---
title: "Color Quantisation in Operating Systems"
date: 2026-05-17
tags: [markdown, guide]
excerpt: "Color Quantisation in Operating Systems"
---

# Introduction

- Colour Quantisation is the process of mapping colours from a source image to the nearest available colour in a display device's limited palette.

- It becomes necessary in graphical OS environments when a display device cannot represent all colours present in an image.

- The source image is assumed to be a 24-bit bitmap with 8 bits each for red, green, and blue — the typical worst-case scenario for colour depth.

- The Colour Quantiser is the system component responsible for performing this mapping.

- Dithering is a related technique often applied alongside quantisation to simulate missing colours by spatially mixing available ones, improving overall reproduction quality.

- The term "Colour Quantisation" has a second meaning — calculating a reduced palette from an image that preserves colour detail.

# Non Paletted Quantisation