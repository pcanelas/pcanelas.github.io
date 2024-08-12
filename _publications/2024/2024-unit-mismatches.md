---
title:          "Is it a Bug? Understanding Physical Unit Mismatches in Robot Software"
date:           2024-01-15 00:00:00 +0800
selected:       true
pub:            "International Conference in Robotics and Automation (ICRA)"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       '&nbsp;&nbsp;<span class="badge badge-pill badge-publication badge-success">Just Accepted!</span>'
pub_date:       "2024"

abstract: >-
  Robot software often involves variables representing physical units like meters and seconds. Incorrect operations on these units can cause dangerous system behaviors, and detecting such errors manually is challenging. Current analysis techniques use dimensional analysis rules to find mismatches but often flag intentional mismatches, leading to false positives  that impede robotics developer trust and productivity. This study inspects 180 errors detected by the Phys tool and identifies three types of physical unit mismatches, categorizing them into eight high-level categories. We find that developers often introduce intentional mismatches, such as differential drives, small angle approximations, and controls.
authors:
  - Paulo Canelas
  - Trenton Tabor
  - John-Paul Ore
  - Alcides Fonseca
  - Claire Le Goues
  - Christopher S. Timperley
links:
  DOI: https://doi.org/10.1109/ICRA57147.2024.10611413
  Paper: https://squareslab.github.io/materials/canelas2024physunits.pdf
---
