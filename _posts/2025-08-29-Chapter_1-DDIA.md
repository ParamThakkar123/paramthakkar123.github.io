# Chapter 1 : Reliable, Scalable and Maintainable Applications

## Introduction

The author has said that many applications today are data-intensive, as opposed to compute intensive. I also believe that it's both now. Applications being built today are both data as well as compute intensive.

A data intensive application is typically built from standard building blocks that provide commonly needed functionality.

There are many applications which require data:
1. Databases store data so that they, or another application can find it later.
2. Caches remember the results of expensive (or repetetive) calculations which can be used later to speed up reads.
3. Search indexes allow users to search data by keyword or filter it in various ways.
4. Stream processing involves sending a message to another process, to be handled asynchronously.
5. Batch processing periodically crunches a large amount of accumulated data.

There are many database systems with different characteristics tailored to different requirements for different use cases. When building an application we need to figure out which tools and which approaches are the most appropriate for the task at hand.

## Thinking About Data Systems

This section talks about how to think about various data systems. There are wide variety of tools and of very different categories. Although a database and a message queue have some superficial similarity - both store data for some time- they have very different access patterns

![One possible architecture for a data system that combines several
 components.](image.png)

- When you combine several tools in order to provide a service, the service’s interface or application programming interface (API) usually hides those implementation details from clients

-  There are many factors that may influence the design of a data system, including the skills and experience of the people involved,legacy system dependencies, the time scale for delivery, your organization’s tolerance of different kinds of risk, regulatory constraints, etc. Those factors depend very much on the situation.

There are three concerns that are important in most software systems: 

1. Reliability: The system should continue to work correctly (performing the correct function at the desired level of performance) in any case.

2. Scalability: As the system grows (in data volume, traffic volume, or complexity), there should be reasonable ways of dealing with that growth.

3. Maintainability: Over time, many different people will work on the system (engineering and operations, both maintaining current behavior and adapting the system to new use cases), and they should all be able to work on it productively.

## Reliability

For software, typical reliability expectations include:
- The application performs the function that the user expected.
- It can tolerate the user making mistakes or using the software in unexpected ways.
- Its performance is good enough for the required use case, under the expected load and data volume.
- The system prevents any unauthorized access and abuse.

That means, the system should be working correctly even when things go wrong. The things that can go wrong are called `faults` and systems that anticipate faults and can cope with them are called `fault-tolerant` or `resilient`.

A fault is not the same as failure. A fault is usually defined as one component of the system deviating from its spec, whereas a failure is when the system as a whole stops providing the required service to the user.

Many critical bugs are actually due to poor error handling. By deliberately inducing faults, we can ensure that the fault tolerance machinery is continually exercised and tested,

We generally prefer tolerating faults over preventing faults (as opposed to prevention is better than cure philosophy because no cure exists)

## Hardware Faults