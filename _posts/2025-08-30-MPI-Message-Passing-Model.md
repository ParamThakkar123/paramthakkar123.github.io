# MPI Series Part 1

In this particular series of blogs we will explore what is MPI, how can we do parallel programming in MPI, what exactly is parallel programming, how MPI works internally and whole bunch of stuff. Let's get started.

## Introduction

### What is Parallel Programming ?
### Sequential vs Parallel Pardigms
### What is MPI ?
### What is Message Passing ?

## The Message Passing Model
## Distributed Memory Architectures
## Messages

- A message tranfers a number of data items of a certain type from the memory of one process to the memory of another process.

- A message typically contains: 
    - The ID of the sending processor
    - The ID of the receiving processor
    - The type of the data items
    - The number of the data items
    - The data itself
    - A message type identifier

## Communication Modes

- Sending a message can either be synchronous or asynchronous.
- A synchronous send is not completed until the message has started to be received.
- An asynchronous send completes as soon as the message has gone.
- Receives are usually synchronous - the receiving process must wait until the message arrives.

## Synchronous and Asynchronous Transmission
## Point to Point Communications
## Collective Communications 
### Barrier
### Broadcast
### Scatter
### Gather
### Reduction Operations
## Launching a Message Passing Program

- Write a single piece of source code with calls to message-passing functions such as send / receive.

- Compiler with a standard compiler and link to a message-passing library provided for you both open-source and vendor-supplied libraries exist.

- Run multiple copies of the same executable on parallel machine:
    - Each copy is a separate process
    - Often results in simple communication patterns

- Use collective communications where possible may be implemented in efficient ways

https://www.geeksforgeeks.org/operating-systems/message-passing-model-of-process-communication/

https://www.geeksforgeeks.org/operating-systems/architecture-of-distributed-shared-memorydsm/

https://www.geeksforgeeks.org/operating-systems/inter-process-communication-ipc/

https://www.geeksforgeeks.org/operating-systems/methods-in-interprocess-communication/

https://www.geeksforgeeks.org/computer-organization-architecture/single-program-multiple-data-spmd-model/

https://www.geeksforgeeks.org/computer-networks/difference-between-synchronous-and-asynchronous-transmission/

https://www.geeksforgeeks.org/system-design/point-to-point-communication-in-distributed-systems/

https://chatgpt.com/share/68b28b26-d568-800e-bd5a-13ef36e9c790