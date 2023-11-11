# Onshape Rendering Test
Test of an online demo for an exported onshape cad model.

CAD model used: Westwood Robotics 2023 DISARM

## Process
1. Onshape export to obj
2. [obj2gltf](https://github.com/CesiumGS/obj2gltf)
    1. --seperate
3. [gltfpack](https://meshoptimizer.org/gltf/)
    1. use binary release w/ max compression -cc
    2. file size max: 100MB after compression (for github pages)
4. model is decompressed in the browser

   
[Link to online test](https://zanbowie138.github.io/OnshapeRenderingTest/)
