---
title: "Image Sensing Pipeline"
date: 2026-05-31
course: "Computer Vision by Andreas Geiger"
chapter: "Image Formation in Computer Vision"
tags: [markdown, guide]
excerpt: "Lecture 2.4 notes on Introduction to Computer Vision by Andreas Geiger"
---

![Image Sensing Pipeline](image-28.png)

The image sensing pipeline can be divided into three stages:
- Physical light transport in the camera lens/body.
- Photon measurement and conversion on the sensor chip
- Image signal processing (ISP) and image compression.

## Shutter

![Shutter](image-29.png)

- A focal plane shutter is positioned just in front of the image sensor/film
- Most digital cameras use a combination of mechanical and electronic shutter.
- The shutter speed (exposure time) controls how much light reaches the sensor.
- It determines if an image appears over-/underexposed, blurred or noisy.

## Sensor
- CCDs move charge from pixel to pixel and convert it to voltage at the output node.
- CMOS images convert charge to voltage inside each pixel and are standard.
- Larger chips (full frame=35mm) are more photo sensitive => less noise.

## Color Filter Arrays

- To measure color, pixels are arranged in a color array
- Missing colors at each pixel are interpolated from neighbors (demosaicing).

![Color Filter Arrays](image-30.png)

- Each pixel integrates the light spectrum L according to its spectral sensitivity S:

![R](image-31.png)

- The spectral response curves are provided by the camera manufacturer.

## Gamma Compression

![Gamma Compression](image-32.png)

- Humans are more sensitive to intensity differences in darker regions.
- Therefore, it is beneficial to nonlinearly transform (left) the intensities or colors prior to discretization (left) and to undo this transformation during loading.

## Image Compression

- Typically luminance is compressed with higher fidelity than chrominance.
- Often, patch-based discrete cosine or wavelet transforms are used.
- Discrete Cosine Transform (DCT) is an approximation to PCA on natural images.
- The coefficients are quantized to integers that can be stored with Huffman codes.