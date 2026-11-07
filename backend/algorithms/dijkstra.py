# ============================================================
# dijkstra.py — Dijkstra's Shortest Path Algorithm
# ============================================================
# Uses a priority queue (heapq) to achieve optimal O((V + E) log V)
# time complexity for finding the shortest path in temple networks.
#
# Educational Note for Student/Examiner:
# - V = vertices (temple checkpoints, e.g. Entry, Queue Hall, Sanctum)
# - E = edges (walkways, corridors with measured distances)
# - Priority queue guarantees we always greedily expand the closest
#   unvisited checkpoint first.
# ============================================================

import heapq
import math

def run_dijkstra(graph, source, target):
    """
    Find the shortest path from source to target in a graph.
    
    Parameters:
        graph: dict — {node_id: [(neighbor_id, distance), ...]}
        source: str — Starting checkpoint ID (e.g., 'ENTRY')
        target: str — Destination checkpoint ID (e.g., 'EXIT_NORTH')
        
    Returns:
        dict with:
            success (bool),
            path (list of node IDs),
            totalDistance (float/int),
            steps (list of step dicts),
            nodesExplored (int)
    """
    if source not in graph:
        return {
            'success': False,
            'path': [],
            'totalDistance': 0,
            'steps': [],
            'error': f"Source checkpoint '{source}' does not exist in graph."
        }
        
    if target not in graph:
        return {
            'success': False,
            'path': [],
            'totalDistance': 0,
            'steps': [],
            'error': f"Destination checkpoint '{target}' does not exist in graph."
        }

    if source == target:
        return {
            'success': True,
            'path': [source],
            'totalDistance': 0,
            'steps': [],
            'nodesExplored': 1,
            'message': 'Source and destination are identical.'
        }

    # Step 1: Initialize distances dictionary and priority queue
    distances = {node: math.inf for node in graph}
    distances[source] = 0
    previous = {node: None for node in graph}
    
    # Priority Queue stores tuples of (distance, node_id)
    pq = [(0, source)]
    visited = set()

    # Step 2: Dijkstra's main loop with Priority Queue
    while pq:
        curr_dist, curr_node = heapq.heappop(pq)
        
        if curr_node in visited:
            continue
        visited.add(curr_node)
        
        if curr_node == target:
            break
            
        # Explore neighbors
        for neighbor, weight in graph.get(curr_node, []):
            if neighbor in visited:
                continue
                
            new_dist = curr_dist + weight
            if new_dist < distances.get(neighbor, math.inf):
                distances[neighbor] = new_dist
                previous[neighbor] = curr_node
                heapq.heappush(pq, (new_dist, neighbor))
                
    # Step 3: Check reachability
    if distances.get(target, math.inf) == math.inf:
        return {
            'success': False,
            'path': [],
            'totalDistance': 0,
            'steps': [],
            'error': f"No connected pathway exists from '{source}' to '{target}'."
        }

    # Step 4: Reconstruct path
    path = []
    curr = target
    while curr is not None:
        path.insert(0, curr)
        curr = previous[curr]
        
    # Step 5: Format human-readable steps with segment distances
    steps = []
    for i in range(len(path) - 1):
        u, v = path[i], path[i + 1]
        dist = 0
        for nbr, w in graph.get(u, []):
            if nbr == v:
                dist = w
                break
        steps.append({
            'from': u,
            'to': v,
            'distance': dist
        })
        
    return {
        'success': True,
        'path': path,
        'totalDistance': distances[target],
        'steps': steps,
        'nodesExplored': len(visited)
    }
