---
title: "Video Codecs"
date: 2026-05-17
tags: [markdown, guide]
excerpt: "Notes on Video Codecs"
---

# Introduction
- Video Codecs reduces the audio and video file size making it easy to stream and store without affecting the quality
- Video codec is a software or system that manages visual content by compressing or decompressing data for easier storage or faster streaming over networks.
- Video codecs use algorithms to reduce massive voice and video files smaller
- Codecs convert the raw data into byte-sized sequences so they can easily transmit across networks and reach the end points as voice and video.

# Codecs vs Containers
- In video apps, **Video Format = Codec + Container**
- Codec is a software that uses algorithms to encode and decode video and audio data. The key purpose of a code is to simplify parts of the files and make them more manageable: **Codec = Encoder + Decoder**
- It removes the redundant information in data, converts them into byte sequences and decompresses back into playable video and audio.
- On the other hand, a container is the file format or wrapper of the video and audio. It organizes the byte-sized content that the codec generates after compression.
- **Container = File Format --> File Extension(.mp4, .mov)**
- Container wraps the video streams and meta data together in a single file.
- The meta data usually contains related information like bitrate, resolution, device type, sub-titles and date of creation

# Types of Video Compression
- Video compression, performed by codecs, relies on methods to reduce file size and manage quality.
- There are 3 primary types of video compression: Lossy compression, lossless compression, and hybrid/enhancement layers.

## Lossy Compression
- Reduces file size by removing redundant data from the original file.
- It uses a technique known as Quantization to discard the high-frequency coefficient identified in the prediction error
- This method is suitable when the bandwidth is limited and is commonly used by modern codecs like H.264/AVC and H.265/HEVC.
- However, a key drawback of this method is that the output looks pixelated.

## Lossless compression
- Reduces file size without any loss in quality
- Uses a technique called entropy coding. It reduces the statistical redundancy by assigning shorter codes to frequent symbols and longer codes to less frequent symbols.
- Lossless compression is majorly used in professional post-production workflows and codecs like FLAC (Free Lossless Audio Codec) adopt this technique to produce high-quality outputs where file-size is not a concern

## Hybrid/Enhancement Layers
- In this method, codecs use a combination of 2 compression types: Spatial (individual images) and temporal (sequence of images)

A. Inter Frame Compression (Temporal Compression)
- Technique where the codecs store some of the frames in the video as key frames (I-frames) and the other frames in-between the key frames as delta frames.
- When stored in this method, the codecs can identify the redundancy in between the consecutive frames. This sequence of frames is known as Group of Pictures (GOP), and it typically contains 3 types of frames:
1. I-frames (Intra-frames): These are frames containing complete pictures without any reference to other coded pictures.
2. P-frames (Predictive frames): These frames look at a previous frame to identify if there are any differences in motion
3. B-frames (Bi-predictive frames): These frames look at the motion in previous frames and predict the motion that may occur in the next frame

- As a whole, when the codecs categorize the frames based on the above criteria, it causes changes in the reference frames. 
- The resulting incremental value of changes lead to reduction in the data volume, helping the codec achieve compression without losing data.

## Intra-Frame Compression (Spatial Compression)

- Codecs access each frame independently and compress them individually.
- The technique is otherwise known as All-I or All-Infra compression.
- The technique is specifically used to test the prediction tools and spot the errors.
- Intermediary codecs like ProRes and DNx generally use it since each frame is easily accessible and the results of the compression is generally high-quality.

## Enhancement Layers (Modern Codec Tools)

- Involves incorporating advanced enhancement layers and tools to make the compression outcomes more efficient.
Some modern codec tools include:

### Intra Sub-partitions (ISP):
- Intra-coded blocks can be split into smaller parts, probably two or four
- The first part's reconstructed signal is then used to predict the next part. This reduced the need for additional signaling for prediction modes.

### Combined Inter and Intra Prediction (CIIP):
- In this method, the codec creates 2 predictions -- one with a regular inter-prediction and another with a limited intra-prediction
- The codec then uses weighted averaging to combine both these predictions to form the final prediction.

### Intra Block Copy:
- Intra block copy is a tool that chooses a region of an already reconstructed part, and duplicates it to predict the current block.

### Super resolution:
- The video is first downscaled and encoded at a lower resolution.
- During decoding, the signal is upscaled back to its original resolution.
- After that, in-loop filtering and guided restoration are applied to improve visual quality.

# Major Video Codecs and Standards.

## Current and Dominant Standardized Codecs

### H.264 / AVC / MPEG-4 Part 10
Best For: YouTube, social media, video conferencing, and general streaming

- H.264 is the most common video codec across devices and platforms.
- It’s known as MPEG-4 Part 10 or AVC because it was jointly developed by MPEG and ITU-T.
- H.264 mainly works as an inter-frame codec, meaning it stores only keyframes (I-frames) and the changes between them (P- and B-frames), which keeps file sizes small.
- However, it can also work as an intra-frame codec, where every frame is stored independently for professional workflows.H.264 is considered the codec of the 1080p HD years and is used for recording, editing, and streaming. Popular implementations include x264 and Sony’s XAVC-S, usually wrapped in an MP4 container.

Pros: 
- Excellent balance between quality and file size
- Widely supported across all devices, browsers, and platforms
- Relatively fast to encode and decode
- Mature tools and optimized encoders (like x264)

Cons:
- Less efficient compression compared to newer codecs (HEVC, AV1)
- Not royalty-free (some commercial licensing applies)
- Limited optimization for 4K and HDR content