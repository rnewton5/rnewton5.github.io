---
title:  "Faulty Robot problem"
date:   2018-01-03 12:27:42
categories: [algorithms]
tags: [algorithms]
---
At the Regional ACM Programming Contest 2017, we were presented with the [Faulty Robot problem](https://open.kattis.com/problems/faultyrobot). Unfortunately by the time we got to the problem there was simply not enough time on the clock to complete it and debug our solution. Because it was such an interesting problem to me, I figured I should revisit it on my own and come up with a solution.

You can find all the provided information on [open.kattis.com](https://open.kattis.com/problems/faultyrobot), but in a nutshell the problem is that someone has programmed a robot to explore a graph containing *n* nodes. Each node on the graph can only have at most one forced move away from it going to a neighboring node. However, the robot has some bugs in its code. It may bug out and move to a randomly chosen neighboring node at any time, but such an occurrence can happen at most once during the robots operation, and might not happen at all. If the robot reaches a node that has no forced moves away from it we consider that node to be a stopping point because unless the robot bugs out, there is no way to continue. We need to somehow figure out how many possible stopping points are located on any provided graph.

![faulty robot sample problem image]({{ site.baseurl}}/images/faulty_robot_sample.png)

In the above example, red arrows correspond to a forced move away from a node, and black arrows correspond to a buggy move away from a node. The two nodes with red borders are the possible stopping points. Note that node 3 is not a stopping point because getting to it would require two buggy movements which cannot happen in this problem, so node 3 is totally unreachable. Node 6 is unreachable from node 2, but it can still be reached from node 5. Node 6 is not a possible stoppint point becuase it has a forced move away from it to node 7, which has no moves away from it at all. So the answer to this example is two.

Using this information we can build a recursive algorithm to traverse the graph and figure out all the possible ending points. The function will run through the following steps:

1. if the current node has already been visited, simply return without doing anything
2. place the current node in a data structure containing the visited nodes
3. we'll start out by assuming this node is a stopping point. We set a boolean called "stoppingPoint" to true
4. iterate over all of the paths leading away from the current node.
    * if a path is forced:
        1. this node is not a stopping point. set "stoppingPoint" to false
        2. recursively call this function with the new node as the current node
    * if a path is buggy and the robot has not already bugged out:
        1. recursively call this function with the new node as the current node, a blank visited nodes data structure, and a boolean indicating that it has already bugged out and so cannot travel down any more bugged paths
5. remove the current node from the data structure containing the visited nodes
6. if 'stoppingPoint' is still set to true and this node has not already been added to the data structure containing the possible stopping points, add it to that data structure

The function will need to be provided with a few things:

* the graph (represented as a vector)
* a data structure containing the nodes already visited (to prevent us from infinitly traversing a circuit)
* a data structure containing the nodes that have that have been figured out to be possible stopping points
* an integer to keep track of our current node
* a boolean to keep track of whether the robot has already bugged out
* the number of nodes in the graph

We chose to use C++ at the competition, so I decided to use it here as well.

```c++
void solveFaultyRobot(std::vector<int>& graph, std::vector<int>& visitedNodes, std::vector<int>& stoppingPoints, int currentNode, bool bugged, int numNodes) {

  // if visitedNodes contains the value of the current node, return without doing anything
  if (std::find(visitedNodes.begin(), visitedNodes.end(), currentNode) != visitedNodes.end()) {
    return;
  }

  // push the current node onto the back of the visitedNodes
  visitedNodes.push_back(currentNode);

  // We start by assuming this node is a stopping point, if a forced path
  // is found going away from this node, we set it to false.
  bool isStoppingPoint = true;

  // The robot goes down every single possible path
  for (int i = 0; i < numNodes; ++i) {
    // get the value stored at the location in the graph
    int value = graph[numNodes * currentNode + i];

    // if forced path
    if (value < 0) {
      isStoppingPoint = false;
      solveFaultyRobot(graph, visitedNodes, stoppingPoints, i, bugged, numNodes);
    }
    // if bugged path
    else if (value > 0 && !bugged) {
      std::vector<int> newVisitedNodesList = std::vector<int>();
      solveFaultyRobot(graph, newVisitedNodesList, stoppingPoints, i, true, numNodes);
    }
  }

  // remove this node from visitedNodes
  visitedNodes.pop_back();
  
  if (isStoppingPoint) {
    // if stoppintPoints doesn't already contain this node, we add this node to stoppintPoints
    if (std::find(stoppingPoints.begin(), stoppingPoints.end(), currentNode) == stoppingPoints.end()) {
      stoppingPoints.push_back(currentNode);
    }
  }
}
```

And the driver program:

```c++
int main() {
  // Single letter variables chosen to match kattis website
  int n, m, a, b;
  std::vector<int> graph;

  // Getting the number of nodes and
  // the number of edges on the graph
  std::cin >> n >> m;

  // creating the graph and initializing
  // all values to 0
  graph = std::vector<int>(n * n, 0);

  // getting all of the edges for the graph
  // a forced path is indicated by a -1,
  // a buggy path is indicated by a 1
  for (int i = 0; i < m; ++i) {
    std::cin >> a >> b;
    if (a < 0) {
      a *= -1;
      graph[n * (a - 1) + (b - 1)] = -1;
    }
    else {
      graph[n * (a - 1) + (b - 1)] = 1;
    }
  }

  // now that the graph is filled, we call the 
  // 'solveFaultyRobot' function
  std::vector<int> visitedNodes = std::vector<int>();
  std::vector<int> stoppingPoints = std::vector<int>();
  solveFaultyRobot(graph, visitedNodes, stoppingPoints, 0, false, n);

  // the stoppingPoints vector now contains all the nodes that are
  // possible stopping points. We just output its size.
  std::cout << stoppingPoints.size() << std::endl;

  std::cin.ignore();
  std::cin.get();
  return 0;
}
```

This implementation passes all test cases on the Kattis website. 
