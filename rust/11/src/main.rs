extern crate serde;
extern crate serde_json;

use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::io::{self, Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;

/*
* Graph
*/
type Graph = HashMap<u64, Vec<u64>>;

fn propagate(x: u64) -> Vec<u64> {
    if x == 0 {
        return vec![1];
    }

    let string_rep_of_number = x.to_string();
    let length = string_rep_of_number.len();

    if length % 2 == 0 {
        let mid = length / 2;
        let front: u64 = string_rep_of_number[0..mid].parse().unwrap();
        let back: u64 = string_rep_of_number[mid..length].parse().unwrap();
        return vec![front, back];
    }

    vec![x * 2024]
}

fn build_graph(
    current_value: u64,
    visited: &mut HashSet<u64>,
    graph: &mut Graph,
    steps: u64,
    max_steps: u64,
) {
    if steps >= max_steps {
        return;
    }

    if visited.contains(&current_value) {
        return; // Stop processing this path
    }

    visited.insert(current_value);

    // Call the propagate function and get results
    let results = propagate(current_value);

    // Store results in the graph
    graph.insert(current_value, results.clone());

    // Recursively build the graph for each result
    for result in results {
        build_graph(result, visited, graph, steps + 1, max_steps);
    }

    visited.remove(&current_value);
}

fn create_graph(start_value: u64) -> Graph {
    let mut graph = Graph::new();
    let mut visited = HashSet::new();
    
    build_graph(start_value, &mut visited, &mut graph, 0, 75);
    
    graph
}

fn build_combined_graph(numbers: &[u64]) -> Graph {
    let mut combined_graph = Graph::new();
    
    for &number in numbers {
        let graph = create_graph(number);
        for (key, value) in graph {
            combined_graph.insert(key, value);
        }
    }
    
    combined_graph
}

fn save_graph(graph: &Graph, input: &[u64]) -> Result<(), io::Error> {
    let filename = format!("graph_{:?}.json", input); // Create a filename based on the input
    let data = serde_json::to_string_pretty(graph)?; // Serialize with pretty print
    let mut file = File::create(filename.clone())?;
    file.write_all(data.as_bytes())?;
    
    println!("Graph saved to {}", filename);
    
    Ok(())
}

fn load_graph(input: &[u64]) -> Result<Graph, io::Error> {
    let filename = format!("graph_{:?}.json", input); // Construct the filename
    let mut file = File::open(filename.clone())?;
    
    let mut data = String::new();
    file.read_to_string(&mut data)?;
    
    let graph: Graph = serde_json::from_str(&data)?;
    
    println!("Graph loaded from {}", filename);
    
    Ok(graph)
}

/*
*  Calculate Solution
*/

fn get_flattened_result(
    graph: &Graph,
    input: u64,
    depth: u64,
    cache: &Arc<Mutex<HashMap<(u64, u64), u64>>>
) -> u64 {
    // Lock the mutex to access the cache safely
    {
        let cache = cache.lock().unwrap();

        // Check if the result is already cached
        if let Some(&result) = cache.get(&(input, depth)) {
            return result;
        }
    } // MutexGuard is dropped here

    // Base case
    if depth == 0 {
        return 1;
    }

    // Recursive case
    let result = if let Some(next) = graph.get(&input) {
        next.iter()
            .map(|&e| get_flattened_result(graph, e, depth - 1, cache))
            .sum()
    } else {
        0
    };

    // Store the result in the cache
    {
        let mut cache = cache.lock().unwrap();
        cache.insert((input, depth), result);
    } // MutexGuard is dropped here

    result
}

fn main() -> Result<(), io::Error> {
    let input = vec![814, 1183689, 0, 1, 766231, 4091, 93836, 46];
    
    println!("getting graph");
    let graph_result = load_graph(&input).or_else(|_err| {
        println!("did not find existing graph, start building it");
        let graph = build_combined_graph(&input);
        save_graph(&graph, &input);
        Ok::<HashMap<u64, Vec<u64>>, Graph>(graph)
    }).unwrap();
    
    println!("Got Graph. result of 0 {:?}, of 1 {:?}, of 2024 {:?}",
        graph_result.get(&0),
        graph_result.get(&1),
        graph_result.get(&2024)
    );

    // Use Arc to share the graph safely across threads.
    let graph_arc = Arc::new(graph_result);
    let cache = Arc::new(Mutex::new(HashMap::new()));

    let handles: Vec<_> = input.iter().map(|&i| {
        let graph_clone = Arc::clone(&graph_arc);
        let cache_clone = Arc::clone(&cache);
        
        thread::spawn(move || {
            println!("Thread for {}", i);
            let result = get_flattened_result(&graph_clone, i, 75, &cache_clone);
            println!("Result for thread {} is {}", i, result);
            result
        })
    }).collect();

   // Collect results from threads.
   let mut stones_sum = 0;
   for handle in handles {
       stones_sum += handle.join().unwrap();
   }

   println!("all stones combined {}", stones_sum);
   println!("should be 238317474993392");

   Ok(())
}
