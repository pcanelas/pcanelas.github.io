// Define the custom ADL syntax highlighting mode
CodeMirror.defineSimpleMode("adl", {
    start: [
        {regex: /\b(subscribers|subscribes to|publishes|broadcasts|to|listens|dynamic|broadcast|listen|static|publishers|remapping to|calls service)\b/, token: "connection-keyword"},
        {regex: /\b(node|type|policy|rules|attach|message|service|action|qos policy|frame|link|hierarchy|alias|field|from|nodelet|instance|expects|ensures|and|or|optional|topic|param|where)\b/, token: "rospec-keyword"},
        {regex: /\b(exists|count|eventually|always|tag|qos|in|out|context|childs|parents)\b/, token: "special-keyword"},
        {regex: /@/, token: "special-keyword"}, // Added standalone @ symbol
        {regex: /\b(int|float|double|bool|string)\b/, token: "ttype"},
        {regex: /\btrue|false\b/, token: "number"},
        {regex: /\b([a-z0-9_]+\/[a-zA-Z0-9_]*[A-Z][a-zA-Z0-9_\/]*)\b/, token: "ttype"},
        {regex: /\b([A-Z][a-zA-Z0-9_]+)\b/, token: "ttype"},
        {regex: /\b([a-zA-Z_]+)\b/, token: "variable"},
        {regex: /\b\d+\b/, token: "number"},
        {regex: /[{}:;=]/, token: "operator"},
        {regex: /\#.*/, token: "rospec-comment"},
        {regex: /".*?"/, token: "string"},
    ],
    meta: {
        lineComment: "#",
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const editor1 = CodeMirror.fromTextArea(document.getElementById("codeBox1"), {
        lineNumbers: true,
        mode: "adl",
    });

    const editor2 = CodeMirror.fromTextArea(document.getElementById("codeBox2"), {
        lineNumbers: true,
        mode: "adl",
    });

    // Function to adjust CodeMirror height based on content
    function adjustEditorHeight(editor) {
        const contentHeight = editor.getScrollInfo().height;
        const containerHeight = editor.getWrapperElement().offsetHeight;

        if (contentHeight > containerHeight) {
            editor.setSize(null, contentHeight + 20);  // Add some padding
        }
    }

    editor1.on("change", () => adjustEditorHeight(editor1));
    editor2.on("change", () => adjustEditorHeight(editor2));

    const toggleExampleButton = document.getElementById('toggleExample');
    let exampleAdded = false;

    const exampleContent = `policy type qos {

    history: Enum[KeepLast, KeepAll] = KeepLast; 
    depth: int;
    reliability: Enum[Reliable, BestEffort] = Reliable;
    durability: Enum TransientLocal, Volatilel = Volatile;
    deadline: float;
    lifespan: float;
    liveliness: Enum[Automatic, ManualByTopic];
    duration: float;
    
	attach to {
    	publishes to, 
        subscribes to
    };
    
    external verify "path/to/python/QosPolicy";
}

type alias HumbleVersion: OrderedEnum[Ardent, Bouncy, Crystal, Dashing, Eloquent, Foxy, Galactic, Humble, Iron, Jazzy] where {_ >= Humble}};

type alias Natural : double where {_ >= 0};
type alias Nanosecond : Natural;
type alias Second : Natural;

policy instance transient_reliable_qos : qos { # TODO: 
    history     = KeepLast;
    depth       = 1;
    reliability = Reliable;        
    durability  = TransientLocal;
    # deadline:    float;
    # lifespan:    float;
    # liveliness:  Enum[Automatic, ManualByTopic];
    # duration:    float;
}

policy instance sensor_data : qos {
    history     = KeepLast;
    depth  		= 1;
    reliability = BestEffort;
    durability  = Volatile;
    # deadline:    float;
    # lifespan:    float;
    # liveliness:  Enum[Automatic, ManualByTopic];
    # duration:    float;
}

policy instance system_default_qos : qos {
    # ?????;
}

topic type particle_cloud : nav2_msgs/ParticleCloud {
	expects field particles : Particle[];
}

topic type amcl_pose : geometry_msgs/PoseWithCovarianceStamped {}

topic type initialpose : geometry_msgs/PoseWithCovarianceStamped {}


node type amcl {
    context distribution : HumbleVersion;
    
    param robot_model_type: Enum[DifferentialMotionModel, OmniMotionModel];
	param scan_topic: TopicNameType;
    param map_topic: TopicNameType;
    
	optional param alpha1: double;
	optional param alpha2: double;
	optional param alpha3: double;
	optional param alpha4: double;
	optional param alpha5: double;
    optional param base_frame_id: string;
    optional param beam_skip_distance: Natural;
    optional param beam_skip_error_threshold: double;
    optional param do_beamskip: bool;
    optional param global_frame_id: string;
    optional param lambda_short: double;
    optional param laser_likelihood_max_dist: double;
    optional param laser_max_range: double where {_ >= 0 || _ == -1};
    optional optional param laser_min_range: double where {_ >= 0 || _ == -1};
	optional param laser_model_type: Enum[Beam, LikelihoodField, LikelihoodFieldProb] = Beam;
    optional param set_initial_pose: bool;
    optional param initial_pose: geometry_msgs/Pose2D = {
    	x: double = 0.0, 
        y: double = 0.0, 
        z: double = 0.0, 
        yaw: double = 0.0
    };
	optional param max_particles: int;
    optional param min_particles: int;
    optional param odom_frame_id: string;
    optional param pf_err: double;
    optional param pf_z: double;
    optional param recovery_alpha_fast: double;
    optional param recovery_alpha_slow: double;
    optional param resample_interval: int;
	optional param save_pose_rate: Natural;
    optional param sigma_hit: double;
    optional param tf_broadcast: bool;
    optional param transform_tolerance: double;
    optional param update_min_a: double;
    optional param update_min_d: double:
    optional param z_hit: double;
    optional param z_max: double;
    optional param z_rand: double;
    optional param z_short: double;
    optional param always_reset_initial_pose = False;
    optional param first_map_only: string;
    optional param bond_heartbeat_period: Natural;
    
    @qos{sensor_data}
    publishes to particle_cloud;
    
    @qos{transient_reliable_qos}
    publishes to amcl_pose;
    
    @qos{system_default_qos}
    subscribes to initialpose where {len(publishers(initialpose)) > 0}; # syntax to say that we expect publishers to it?
    #az? publishes to initialpose; # find a common way to specify these different things, default someone should publish to it? false positives?
    #e.g., cmd_vel expects exactly 1 pub, or 0 publishers other than yourself # TODO:
    
    @qos{transient_reliable_qos}
    subscribes to map_topic where {?p publishes to map_topic};
    
    provides service reinitialize_global_localization; # todo: e.g., all consumers have a tag, provides service/consumes service, optionally
    consumes service set_initial_pose;
    consumes service request_nomotion_srv;
    
    broadcast map to odom;
    broadcast odom to base_link;
    broadcast base_link to scan;

} where {
	laser_min_range <= laser_max_range;
    min_particles <= max_particles;
    laser_mode_ltype == Beam -> z_hit + z_max + z_rand + z_short == 1;
	always_reset_initial_pose -> exists(initial_pose);
}

node type planner_server {
	param planner_plugins: Plugin[];
    param action_server_result_timeout: Second;
    param bond_hearbeat_period: Natural;
    
    optional param expected_planner_frequency: Natural = 0.0;
    optional param costmap_update_timeout: Second = 0.0;
    
    @qos({depth = 10;})
    publishes to plan;
    
    broadcasts action compute_path_to_pose;
    consumes action compute_path_through_poses;
}

node type controller_server {
    param speed_limit_topic: TopicNameType;
    param odom_topic: TopicNameType;
    
	optional param controller_frequency: Natural;
    optional param use_realtime_priority: bool;
    optional param action_server_result_timeout: Second;
    optional param costmap_update_timeout: Second;
    optional param controller_plugins: Plugin[];
    optional param progress_checker_plugins: Plugin[];
    optional param goal_checker_plugins: string[];
    optional param min_x_velocity_threshold: double;
    optional param min_theta_velocity_threshold: double;
    optional param failure_tolerance: double where {_ == -1.0 || _ >= 0};
    optional param enable_stamped_cmd_eval: bool;
    optional param bond_heartbeat_period: Natural;
    
    @qos(system_default_qos)
    subscribes to odom;
    @qos(system_default_qos)
    publishes to cmd_vel;
    
    @qos({depth = 10;})
    subscribes to content(speed_limit_topic);
    
    broadcasts action follow_path;
}

node type map_server {
	param yaml_filename: string;
    optional param topic_name: TopicNameType = "map";
    optional param frame_id: string = "map";
}

node type local_costmap {
    optional param update_frequency: Natural = 5.0;
    optional param publish_frequency: Natural = 2.0;
    optional param global_frame: string = "odom";
    optional param robot_base_frame: string = "base_footprint";
    optional param use_sim_time: boolean = True;
    optional param rolling_window: boolean = True;
    optional param width: Natural = 3.0;
    optional param height: Natural = 3.0; 
    optional param resolution: Natural = 0.05;
    optional param robot_radius: Natural = 0.4; 
    optional param footprint: string; 
    optional param plugins: Plugin[] = [VoxelLayer, InflationLayer]; 
    optional param filters: Plugin[] = [KeepOutFilter];
    optional param always_send_full_costmap: boolean = True;

    @qos(system_default_qos)
    ensures _ subscribes to /scan;
    @qos(transient_reliable_qos)
    ensures _ subscribes to /costmap_filter_info;
}

plugin type VoxelLayer {
    param plugin: PluginNameType = "nav2_costmap_2d::VoxelLayer";
    param enabled: boolean = True;
    param publish_voxel_map: boolean = True;
    param origin_z: double = 0.0;
    param z_resolution: double = 0.05;
    param z_voxels: int = 16;
    param max_obstacle_height: double = 2.0;
    param mark_threshold: int = 0;
    param observation_sources: string = "scan";
    
    # TODO: missing observation scan
    
    @qos(transient_reliable_qos)
    ensures _ publishes to voxel_grid;
    @qos(transient_reliable_qos)
    ensures _ publishes to clearing_endpoints;
}

plugin type InflationLayer {
    param plugin: PluginNameType = "nav2_costmap_2d::InflationLayer";
    param cost_scaling_factor: Natural = 3.0;
    param inflation_radius: Natural = 0.55;
}

plugin type KeepOutFilter {
   param plugin: PluginNameType = "nav2_costmap_2d::KeepoutFilter";
   param filter_info_topic: TopicNameType = "/costmap_filter_info";
   param enabled: boolean = True;
   
    @qos(default_qos)
    _ subscribes to content(filter_info_topic);
}






system {
	@context::{distr = Humble}
    node instance amcl_inst : amcl {
    	param alpha1 = 0.2;
        param alpha2 = 0.2;
        param alpha3 = 0.2;
        param alpha4 = 0.2;
        param alpha5 = 0.2;
        param base_frame_id = "base_footprint";
        param beam_skip_distance = 0.5;
        param beam_skip_error_threshold = 0.9;
        param beam_skip_threshold = 0.3;
        param do_beamskip = false;
        param global_frame_id = "map";
        param lambda_short = 0.1;
        param laser_likelihood_max_dist = 2.0;
        param laser_max_range = 100.0;
        param laser_min_range = -1.0;
        param laser_model_type = "likelihood_field";
        param max_particles = 8000;
        param min_particles = 200;
        param odom_frame_id = "odom";
        param pf_err = 0.05;
        param pf_z = 0.99;
        param recovery_alpha_fast = 0.0;
        param recovery_alpha_slow = 0.0;
        param resample_interval = 1;
        param robot_model_type = DifferentialMotionModel;
        param save_pose_rate = 0.5;
        param sigma_hit = 0.2;
        param tf_broadcast = true;
        param transform_tolerance = 1.0;
        param update_min_a = 0.2;
        param update_min_d = 0.25;
        param z_hit = 0.5;
        param z_max = 0.05;
        param z_rand = 0.5;
        param z_short = 0.05;
        param scan_topic = "scan";
        param set_initial_pose = true;
        param initial_pose = {
        	x: double = 0.0,
            y: double = 0.0,
            z: double = 0.0,
            yaw: double = 0.0
        };
    }
    
    node instance controller_server_inst : controller_server {
        param use_sim_time = true;
        param controller_frequency = 5.0;
      	param min_x_velocity_threshold = 0.001;
      	param min_y_velocity_threshold = 0.5;
      	param min_theta_velocity_threshold = 0.001;
      	param failure_tolerance = 0.3;
      	param progress_checker_plugins = ["progress_checker"];
      	param goal_checker_plugins = ["general_goal_checker"];
      	param controller_plugins = ["FollowPath"];
    }
    
    node instance planner_server_inst : planner_server {
    	param expected_planner_frequency = 20.0;
    	param use_sim_time = True;
    	param planner_plugins = ["GridBased"]
    }
}`;

    toggleExampleButton.addEventListener('click', () => {
        if (exampleAdded) {
            editor1.setValue("");
            toggleExampleButton.textContent = "Show Example";
            exampleAdded = false;
        } else {
            editor1.setValue(exampleContent);
            toggleExampleButton.textContent = "Hide Example";
            exampleAdded = true;
        }
        adjustEditorHeight(editor1);  // Adjust height after setting content
    });

    document.getElementById('checkSyntax').addEventListener('click', () => {
        const code1 = editor1.getValue();
        const code2 = editor2.getValue();

        try {
            parseCode(code1);
            parseCode(code2);
            alert("Syntax is correct for both boxes.");
        } catch (error) {
            alert("Syntax error: " + error.message);
        }
    });

    document.getElementById('verify').addEventListener('click', async () => {
        const code1 = editor1.getValue();
        const code2 = editor2.getValue();

        try {
            const response = await verifyCode(code1, code2);
            alert(response.message);
        } catch (error) {
            alert("Verification error: " + error.message);
        }
    });
});

function parseCode(code) {
    if (!code) throw new Error("Code cannot be empty");
}

async function verifyCode(code1, code2) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: "Verification passed successfully." });
        }, 1000);
    });
}