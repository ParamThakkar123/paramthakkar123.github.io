---
title: "Structure from Motion Preliminaries"
date: 2026-05-31
course: "Computer Vision by Andreas Geiger"
chapter: "Structure from Motion"
tags: [markdown, guide]
excerpt: "Lecture 3.1 notes on Introduction to Computer Vision by Andreas Geiger"
---

## Preliminaries of SfM

### Camera Calibration

- Camera calibration is the process of finding the intrinsic/extrinsic parameters
- Most commonly, a known calibration target (image, checkerboard) is used.

- First, the known calibration target is captured in different poses
- Second, features (e.g. corners) on the target are detected in the images.

Finally, the camera intrinsics and extrinsics (=poses) are jointly optimized:
- Closed form solution initializes all parameters except for distortion parameters.
- Non-linear optimization of all parameters by minimizing reprojection errors.
- There exists a variety of calibratio technique that are used in different settings
- These methods differ algorithmically, but also in the type of assumptions and calibration targets they use: 2D / 3D targets, planes, vanishing points, etc.

### Feature Detection and Description

#### Point Features

- Point features describe the appearance of local, salient regions in an image.
- They can be used to describe and match images taken from different viewpoints
- They form the basis of sparse 3D reconstruction methods covered in this lecture.
- Features should be invariant to perspective effects and illumination.
- The same point should have similar vectors independent of pose/viewpoint.
- Plain RGB/intensity patches will not have this property, we need something better.

#### Scale Invariant Feature Transform

- SIFT constructs a scale space by iteratively filtering the image with a Gaussian
- Adjacent scales are subtracted, yielding Difference of Gaussian (DoG) images.
- Interest points (=blobs) are detected as extrema in the resulting scale space.
- SIFT rotates the descriptor to align with the dominant gradient orientation.
- Gradient histograms are computed for local sub-regions of the descriptor.
- All histograms are concatenated and normalized to form a 128D feature vector.
- Feature correspondences can be retrieved with efficient nearest neighbor search
- Ambiguous matches are typically filtered by computing the ratio of distance from the closest neighbor to the distance of the second closest.
- A large ratio (>0.8) indicates that the found match might not be the correct one.