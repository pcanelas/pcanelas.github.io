// Define the custom ADL syntax highlighting mode
CodeMirror.defineSimpleMode("adl", {
    start: [
        {regex: /\b(node|type|message|alias|field|from|instance|expects|ensures|and|or|optional|topic|param|where)\b/, token: "rospec-keyword"},
        {regex: /\b(subscribers|subscribes to|publishes to|publishers)\b/, token: "connection-keyword"},
        {regex: /\b(exists|count|eventually|always)\b/, token: "special-keyword"},
        {regex: /\b(int|float|double|bool|string)\b/, token: "ttype"},
        {regex: /\b([a-zA-Z][a-zA-Z0-9_]+\/[a-zA-Z0-9_]+)\b/, token: "ttype"},
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
        theme: "neo",
    });

    const editor2 = CodeMirror.fromTextArea(document.getElementById("codeBox2"), {
        lineNumbers: true,
        mode: "adl",
        theme: "neo",
    });

    const toggleExampleButton = document.getElementById('toggleExample');
    let exampleAdded = false;

    // Placeholder example content (replace with your actual multiline content later)
    const exampleContent = `node type move_base {
    expects param cost_scaling_factor : double;
    expects param inflation_radius : double;
    expects param robot_radius : double;
    
    ensures subscribes to move_base_simple/goal : geometry_msgs/PoseStamped;
    ensures publishes to cmd_vel : geometry_msgs/Twist;
} where {
    exists(inflation_radius) == exists(cost_scaling_factor);
    robot_radius <= inflation_radius;
}`;

    // Toggle example content in editor1
    toggleExampleButton.addEventListener('click', () => {
        if (exampleAdded) {
            editor1.setValue(""); // Clear the content
            toggleExampleButton.textContent = "Show Example";
            exampleAdded = false;
        } else {
            editor1.setValue(exampleContent); // Add example content
            toggleExampleButton.textContent = "Hide Example";
            exampleAdded = true;
        }
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
    // Add actual parsing logic here
}

async function verifyCode(code1, code2) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: "Verification passed successfully." });
        }, 1000);
    });
}
