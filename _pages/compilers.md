---
layout: post
title: Optimizing Compilers 15-745
permalink: /optimizing-compilers/
author: Sam Estep and Paulo Canelas
---

# Detecting Runtime Check Patterns and Applying Optimization in GVC0

---

## Reports

[Project Proposal (PDF)](https://pcanelas.com/images/compilers-proposal.pdf)

[Project Milestone (PDF)](https://pcanelas.com/images/compilers-milestone.pdf)

[Project Final Report (PDF)](https://pcanelas.com/images/compilers-final.pdf)

[Project Poster (PDF)](https://pcanelas.com/images/compilers-poster.pdf)

---

## Project Description

Gradual verification [[Bader et al., 2018](http://www.cs.cmu.edu/~aldrich/papers/vmcai2018-gradual-verification.pdf)] is a technique that allows developers to incrementally and progressively verify their system by introducing partial specifications. 
Specifications in gradual verification are statically and dynamically verified.
Statically, the verifier assumes any strenghtening of imprecise specifications, and to guarantee soundness, it generates dynamic checks when the partial specifications are optimistically strengthened. 

GVC0 [[DiVincenzo et al., 2022](https://arxiv.org/abs/2210.02428)] is an existing technique for gradual verification is gradual verification which allows one to introduce partial specifications. 
These partial specifications contain static verifications and checks that can only be checked at runtime that are inserted into GVC0. GVC0 is a tool that works on C0 [[Arnold et al., 2010](http://reports-archive.adm.cs.cmu.edu/anon/2010/CMU-CS-10-145.pdf)], a C version used for education, augmented with specifications for gradual verification. In our work, the idea is to take these GVC0 programs and optimize the runtime checks performed.

To this end, this work intends to answer the following two research questions.

- **RQ1. What are the runtime check patterns introduced by GVC0?**

- **RQ2. To what extent do optimizations to runtime checks impact program performance?**

To answer RQ1, we intend to execute GVC0 on the datasets presented in prior work [[Wise et al., 2020](https://dl.acm.org/doi/10.1145/3428296); [DiVincenzo et al., 2022](https://arxiv.org/abs/2210.02428)], manually inspect the generated code with the injected execution checks, study the patterns in which these are introduced, and figure out how they can be optimized.
Regarding RQ2, we plan to use the detected patterns to improve the generated code. We will perform the optimization by either (a) changing the way runtime checks are introduced by GVC0, or (b) developing LLVM passes that detect a pattern and perform an optimization.
Finally, we will evaluate the impact of the optimizations by comparing the runtime performance of the original code with and without optimizations.

We define the goals of the project as follows:

1. **75% Goal:** Detect and describe the patterns present in \gvc's output. Implement one optimization and compare the performance between the optimized and unoptimized code.

2. **100% Goal:** Same as the 75% goal, plus an extra optimization. Perform an ablation study, and check if performance changes as optimizations are applied.

3. **125% Goal:** Same as the 100% goal, plus implement remaining optimizations depending on the number of patterns discovered.

---

