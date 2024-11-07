---
title: Allocating multiple blocks in DE
date: 2024-11-6
categories: [FreeSpace, C, FileSystems]
---

# Allocating multiple blocks in DE


**Assume 2 DE's A and B we allocate contiguous  blocks for A and then me we then call A again for A to show discontinuous  allocations**
# Multiple Extent Implementation Analysis

## Overview
Our filesystem implementation successfully demonstrates the ability to handle multiple extents and non-contiguous block allocation through a series of test cases. The results confirm our system's capability to manage complex directory structures with dynamic block allocation.

## Test Results Analysis

### 1. Directory A's Evolution
```
Initial allocation:
Extent 0: startLoc=12884, countBlock=2

After additional allocation:
Total number of extents: 2
Extent 0: startLoc=12884, countBlock=2
Extent 1: startLoc=12890, countBlock=15
```

This demonstrates the system's ability to:
- Manage multiple extents per directory
- Maintain non-contiguous block allocations
- Track multiple extents within the directory structure

### 2. Block Layout Analysis
The test output shows efficient block management:
```
Directory A: blocks 12884-12885 (2 blocks)
Directory B: blocks 12886-12889 (4 blocks)
Directory A's expansion: blocks 12890-12904 (15 blocks)
```

Key features demonstrated:
- Proper interleaving of directories
- Non-contiguous allocation for Directory A
- Accurate extent tracking across multiple allocations

### 3. Implementation Details

#### Data Structure Design

The directory entry structure efficiently handles varying numbers of extents through its flexible design:

```c
typedef struct directory_entry {
    // ... other fields ...
    extents_st data_blocks;  // Holds multiple extents
} directory_entry;
```

#### Block Management Capabilities
Our implementation successfully:
- Allocates initial blocks efficiently
- Manages block allocation for multiple directories
- Handles directory expansion with non-contiguous blocks
- Maintains accurate extent information throughout operations

## Key Features Demonstrated

### 1. Multiple Extent Support
Our filesystem implementation successfully manages non-contiguous storage through multiple extents. As demonstrated in the test output, a single directory can span multiple locations on disk. For example, Directory A initially occupied blocks 12884-12885, and when expanded, acquired additional blocks at 12890-12904, maintaining both locations in its extent array.

### 2. Data Structure Flexibility
The directory entry structure efficiently handles varying numbers of extents. When Directory A grew from one extent (2 blocks) to two extents (2 + 15 blocks), the system properly:
- Maintained the original extent information
- Added the new extent to the array
- Updated the total extent count
- Preserved the non-contiguous block locations

### 3. Block Management
The test results show that our implementation:
- Correctly allocates initial blocks (Directory A: 2 blocks)
- Successfully allocates blocks for other directories (Directory B: 4 blocks)
- Properly manages additional block allocation (Directory A expansion: 15 blocks)
- Maintains extent information across operations

-------------
Hexdump output as sample:

make run
./fsshell SampleVolume 10000000 512
File SampleVolume does exist, errno = 0
File SampleVolume good to go, errno = 0
Opened SampleVolume, Volume Size: 9999872;  BlockSize: 512; Return 0
Initializing File System with 19531 blocks with a block size of 512
Found existing filesystem.

Running tests on existing filesystem...

=== Starting File System Tests ===

Testing Root Directory:
Error: Root directory pointer is NULL!

=== Starting Directory Entry Tests ===

Test 1: Root Directory Creation
Directory creation details:
Bytes needed: 4400
Blocks needed: 9
Actual bytes allocated: 4608
Actual entries possible: 52
Release FSM pointer ...
Directory block allocation:
Extent 0: startLoc=12875, countBlock=9
Writing directory across extents:
Writing to extent 0: startLoc=12875, countBlock=9
Successfully wrote directory (4608 bytes)
Release blocks extents ...

Root Directory Details:
'.' entry:
  Filename: .
  Size: 4608 bytes

Extents Information:
  Extent 0: startLoc=12875, countBlock=9

=== Directory Entry Tests Complete ===

=== Starting Interleaved Directory Test ===

Phase 1: Creating Directory A
Directory creation details:
Bytes needed: 880
Blocks needed: 2
Actual bytes allocated: 1024
Actual entries possible: 11
Release FSM pointer ...
Directory block allocation:
Extent 0: startLoc=12884, countBlock=2
Writing directory across extents:
Writing to extent 0: startLoc=12884, countBlock=2
Successfully wrote directory (1024 bytes)
Release blocks extents ...
Directory A initial allocation:
Size: 1024 bytes
Extent 0: startLoc=12884, countBlock=2

Phase 2: Creating Directory B
Directory creation details:
Bytes needed: 1760
Blocks needed: 4
Actual bytes allocated: 2048
Actual entries possible: 23
Release FSM pointer ...
Directory block allocation:
Extent 0: startLoc=12886, countBlock=4
Writing directory across extents:
Writing to extent 0: startLoc=12886, countBlock=4
Successfully wrote directory (2048 bytes)
Release blocks extents ...
Directory B allocation:
Size: 2048 bytes
Extent 0: startLoc=12886, countBlock=4

Phase 3: Allocating more blocks for Directory A
Release FSM pointer ...
Additional blocks allocated for A:
New Extent 0: startLoc=12890, countBlock=15

Directory A final state:
Total number of extents: 2
Extent 0: startLoc=12884, countBlock=2
Extent 1: startLoc=12890, countBlock=15

Cleaning up test directories...
Release FSM pointer ...
Release FSM pointer ...
Release FSM pointer ...
=== Interleaved Directory Test Complete ===


=== Starting Fragmented Allocation Test ===

Phase 1: Creating Initial Allocations
Release FSM pointer ...
Allocated 4 blocks at 12886
Release FSM pointer ...
Allocated 3 blocks at 12890
Release FSM pointer ...
Allocated 4 blocks at 12893
Release FSM pointer ...
Allocated 3 blocks at 12897
Release FSM pointer ...
Allocated 4 blocks at 12900

Phase 2: Creating Fragmentation
Releasing allocation at 12886 (size 4)
Release FSM pointer ...
Releasing allocation at 12893 (size 4)
Release FSM pointer ...
Releasing allocation at 12900 (size 4)
Release FSM pointer ...

Phase 3: Testing Large Allocation
Release FSM pointer ...
Large allocation results:
Number of extents: 1
Extent 0: startLoc=12900, countBlock=10

Cleaning up allocations...
Release FSM pointer ...
Release FSM pointer ...
=== Fragmented Allocation Test Complete ===

=== File System Tests Complete ===

|---------------------------------|
|------- Command ------|- Status -|
| ls                   |    OFF   |
| cd                   |    OFF   |
| md                   |    OFF   |
| pwd                  |    OFF   |
| touch                |    OFF   |
| cat                  |    OFF   |
| rm                   |    OFF   |
| cp                   |    OFF   |
| mv                   |    OFF   |
| cp2fs                |    OFF   |
| cp2l                 |    OFF   |
|---------------------------------|
Prompt > 


---------------
Important Links:

Logic to handle multiple extents: [[How code is handling multiple Extents]]

Test Codes: [[DE_test]]

---------------
