---
title:          "How does ROS-based Robot Software Evolve? An Empirical Study on Architectural Evolution"
date:           2026-09-07 00:00:00 +0800
selected:       true
pub:           "European Conference on Software Architecture (ECSA)"
# pub_pre:        "Submitted to "
# pub_post:       'Under '
pub_last:       '<span class="badge badge-pill badge-publication badge-success">Just Accepted!</span>&nbsp;&nbsp; 🎉'
pub_date:       "2026"

abstract: >- 
  ROS-based robotic systems are rarely static as developers continuously add, remove, and rewire components as their systems evolve, often without
  documentation. 
  In this work, we study how these architectural changes evolve across open-source ROS repositories by building a differential,
  cross-language recovery tool that tracks component, connection, and configuration changes across releases. 
  We applied it to hundreds of repositories spanning ROS 1 and ROS 2 in C/C++, Python, and XML. 
  We find that evolution diverges by level of analysis: repositories keep growing as new packages are integrated, while individual packages consolidate by pruning connections and configurations as they mature. 
  Changes also tend to co-occur: when a component is removed, its connections and configurations tend to follow in the same release. 
  These findings give specification writers a clearer picture of the maintenance burden of keeping architectural descriptions up-to-date, and point analysis tools toward the mostchange-prone elements.

authors:
  - Paulo Canelas
  - Bradley Schmerl
  - Alcides Fonseca
  - Christopher S. Timperley
links:
  Paper: /assets/papers/2026-ecsa-evolution.pdf
  Artifact: https://figshare.com/s/6843f1c2fd88b48b6ed6
---
