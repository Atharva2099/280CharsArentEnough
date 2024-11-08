---
title: Leetcode No.36 Valid Sudoku
date: 2024-11-07
categories:
  - Leetcode 
  - Medium
  - Data Structure and Algorithms
image: "/images/leetcode-no-36-valid-sudoku.png"
---

# Understanding the Sudoku Board Validator - LeetCode Solution

## Problem Overview
LeetCode problem #36 asks us to validate a 9x9 Sudoku board. A valid Sudoku board must satisfy three conditions:
1. Each row must contain digits 1-9 without repetition
2. Each column must contain digits 1-9 without repetition
3. Each 3x3 sub-box must contain digits 1-9 without repetition

Note that empty cells (marked as ".") are allowed and don't affect validity.

## Solution Approach
Let's break down the solution into digestible pieces to understand how it efficiently validates a Sudoku board in a single pass.

```python

def isValidSudoku(self, board: List[List[str]]) -> bool:
    rows = collections.defaultdict(set)
    cols = collections.defaultdict(set)
    sqrs = collections.defaultdict(set)
```

### Data Structures
We use three `defaultdict(set)` to track numbers in:
- `rows`: Each row of the board
- `cols`: Each column of the board
- `sqrs`: Each 3x3 square

Using `defaultdict(set)` is clever because:
- It automatically creates an empty set when we access a new key
- Sets provide O(1) lookup and insertion
- We don't need to initialize anything manually

### The Main Algorithm
```python

for r in range(9):
    for c in range(9):
        if board[r][c] == ".":
            continue
```
We iterate through each cell. If it's empty ("."), we skip it.

```python

if (board[r][c] in rows[r] or
    board[r][c] in cols[c] or 
    board[r][c] in sqrs[(r//3,c//3)]):
    return False
```

For each number, we check three conditions:
1. Is it already in the current row?
2. Is it already in the current column?
3. Is it already in the current 3x3 square?

The expression `(r//3,c//3)` is particularly clever:
- It maps the 9x9 grid coordinates to 3x3 square coordinates
- For example:
  - Cell (0,0) maps to square (0,0)
  - Cell (1,1) maps to square (0,0)
  - Cell (3,3) maps to square (1,1)

```python

rows[r].add(board[r][c])
cols[c].add(board[r][c])
sqrs[(r//3,c//3)].add(board[r][c])
```

If all checks pass, we:
1. Add the number to its row set
2. Add it to its column set
3. Add it to its 3x3 square set

If we complete the entire board without finding any duplicates, return `True`.

## Time and Space Complexity
- Time Complexity: O(1)
  - We always process exactly 81 cells (9x9 board)
  - Each cell operation is O(1) due to set operations
- Space Complexity: O(1)
  - We store at most 9 numbers in each set
  - We have a fixed number of sets (9 rows + 9 columns + 9 squares)

## Advantages of this Solution
1. **Single Pass**: We only need to traverse the board once
2. **Early Exit**: Returns `False` as soon as an invalid state is detected
3. **Clean Code**: Using `defaultdict(set)` makes the code concise and readable
4. **Efficient Lookups**: Set operations are O(1)

## Common Pitfalls to Avoid
1. Don't forget to check empty cells (".") and skip them
2. Remember that valid numbers are strings ("1" to "9"), not integers
3. The 3x3 square calculation `(r//3,c//3)` must use integer division

## Conclusion
This solution demonstrates how proper data structure choice (using sets) and clever coordinate mapping (for 3x3 squares) can lead to a clean and efficient solution. While there are other ways to solve this problem, this approach provides an excellent balance of readability and performance.