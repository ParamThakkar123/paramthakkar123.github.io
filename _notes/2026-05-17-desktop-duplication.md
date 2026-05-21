---
title: "Microsoft Desktop Duplication API"
date: 2026-05-17
tags: [markdown, guide]
excerpt: "Notes on Microsoft Desktop Duplication API"
---

# Introduction

Desktop Duplication API gives apps frame-by-frame access to the desktop image via DXGO surfaces, so you can throw GPU processing at each frame update.

# Getting Frames

Call `IDXGIOutputDuplication::AcquireNextFrame` to get the current desktop as a DXGI surface. Format is always `DXGI_FORMAT_B8G8R8A8_UNORM` regardless of display mode.

# Knowing what changed

Two methods tell you which pixels actually needed processing:
1. `GetFrameDirtyRects`: returns non-overlapping rectangles covering areas the OS repainted since your last frame.
2. `GetFrameMoveRects`: returns regions the OS moved within the same image (e.g. scrolling). Each entry has a source point and destination rect. Always same size, no stretching.

The pattern: dirty rects = repainted pixels, move rects = relocated pixels. Process move regions first (they reference old frame data), then dirty rects.