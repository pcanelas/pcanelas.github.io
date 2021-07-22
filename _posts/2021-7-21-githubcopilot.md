---
layout: post
title: Can Github Copilot Evolve?
categories: [Github,Copilot,Synthesis]
---

I recently got access to the revolutionary [Github Copilot](https://copilot.github.com/) tool. As any other programmer, I decided to start simple and check its ability to generate an evolutionary algorithm for the Knapsack problem. So, I will share with you my experience and let us try and see how hard it can be for Github Copilot to evolve.

To those unfamiliar with the Knapsack problem, I will give a brief personalized summary:
> Last week Bob invited you to go camping. When preparing your backpack, you remember that you did not attend the gym for the entire year, and so there is a max weight of items you can carry. Plus, all the items you plan to take may have a different value to you. Therefore, your objective is to maximize the value of items you can carry in your backpack.

Although there are multiple ways to approach this problem, we will focus on the evolutionary approach using a genetic algorithm. I have split my experience using Github Copilot into four different stages. 


## Step 1: The Beginning

So, I naively started with a simple generic specification on the problem I planned to solve: 

```python
'''
    Create an evolutionary algorithm to solve the Knapsack problem.
'''
```

At this point, my expectation was for the entire program to be automatically written *(which was not the case)*. Instead, Copilot decides that the first step is to define the `main` function and a simple template of the overall steps in a genetic algorithm. Thus, it not only generates code that **seems** correct as it also has comments in it. The only issue so far is that some of the functions used are not yet implemented, and it appears we will also need to create a new class for the `genetic_algorithm` variable.

```python 
def  main():
    '''
	Main function.
    '''
    # Create the population.
    population = create_population(100, 10, 10)

    # Create the fitness function.
    fitness_function = create_fitness_function(10, 10)
    
    # Create the genetic algorithm.
    genetic_algorithm = create_genetic_algorithm(population, fitness_function)

    # Evolve the population.
    genetic_algorithm.evolve()

    # Print the best individual.
    print(genetic_algorithm.best_individual())
```

Before proceeding to the next step, I made some changes. I created two arrays, one with the values and one with the weights, and provided these to the `create_population` and `create_fitness_function`, instead of the `(10, 10)`. Why? Because the next step would generate random values and would discard the weights... It seems Github Copilot has a hard time having the overall picture of the program we are developing.


## Step 2: Creating the auxiliary functions

So, since the `create_population` and `create_fitness_function` are not yet implemented. I asked Github Copilot to provide me the implementations for each method. 

After some comments instrumentation, I was able to get from the framework implementation for the first function, which seemed all right. A quick tip: at this point, being generic will not help at all... Although the Knapsack is a well-known problem, Github Copilot cannot reasoning about what it should do. 
```python
'''
    Create a population for the KnapSack problem. 
    Each individual in the population is composed by a random array of 
    0s and 1s with the length of the number of values.
'''
def create_population(population_size, weights, values, max_weight):
    def create_individual(weights, values, max_weight):
        individual = []

        for i in range(len(values)):
            individual.append(random.randint(0, 1))

        return individual

    population = []

    # Create the population.
    for i in range(population_size):
        individual = create_individual(weights, values, max_weight)
        population.append(individual)

    # Return the population.
    return population
``` 

The same happens when creating the fitness function. Again, ones should properly define the rules for evaluating the individuals.

```python
'''
    Create the fitness function for the KnapSack problem.
    This function receives the max_weights, values and weights, and should return an 
    auxiliary function that receives an individual. 
    The value returned by that auxiliary function will be the fitness of the individual. 
    The fitness is calculated by summing each value in the values array if the corresponding 
    position in the individual is set to 1. 
    The fitness is 0 if the sum of the weights in which the corresponding position is 1 is 
    greater than the max_weight.
'''
def create_fitness_function(max_weight, values, weights):
    def fitness_function(individual):
        fitness = 0

        for i in range(len(values)):
            if individual[i] == 1:
                fitness += values[i]

        for i in range(len(weights)):
            if individual[i] == 1:
                if fitness > max_weight:
                    fitness = 0
                    break
                else:
                    fitness += weights[i]

        return fitness

    # Return the fitness function.
    return fitness_function
```

The explanation for providing the fitness function is quite more lengthy than the previous ones. If you try to provide an incomplete description, ~~and for personal experience~~, the framework will not produce you a good solution for evaluating your fitness.


## Step 3: Synthesizing the GeneticAlgorithm

The first concern I had when reading the main procedure was if the Copilot would automatically generate the class? The answer for the majority of the time is yes. However, there is one point to be careful. The system does not know what attributes are needed in this class, so it will either simply generate the ones according to the `init` parameters, or, for some unknown reason, generate +15 garbage attributes. So what typically will happen is, as you are writing the class methods, you will need to add the remaining required attributes by hand.
```python
'''
    Create the Genetic Algorithm class.
'''
class GeneticAlgorithm:
    def __init__(self, population, fitness_function, mutation_rate, max_generations):
        self.population = population
        self.fitness_function = fitness_function
        self.mutation_rate = mutation_rate
        self.max_generations = max_generations
```

The final step before we define the genetic operators is the evolution itself. Without any documentation, the Copilot will provide you with a basic mutation-only implementation of evolution:
```python
    def evolve(self):
        for i in range(self.max_generations):
            self.population = self.fitness_function(self.population)
            self.population = self.mutate(self.population)
```

However, we would like to have a more complex genetic algorithm, which contains, for instance, elitism. Adding the description for the `evolve` function was relatively easy. Unfortunately, generating the function itself was not. If we recall, the individual is represented as a list of zeros and ones. For some reason, Github Copilot does not keep track of the previously introduced types, and, when trying to, for instance, sorting the population by their fitness, it tries to access the `individual.fitness`.  A similar happens when evaluating fitness. Although the comment we described earlier states that the `fitness_calculator` should receive an individual to calculate its fitness, instead, the synthesis framework persistently tries to invoke these calculations over the entire population.

The following was the best possible generated code *(I tweaked some parts after)*.

```python
'''
    Define the evolution of the population for max_generations generations.
    For each individual, apply the fitness function to obtain the fitness scores.
    Sort the population by fitness scores.
    Create an empty new population.
    Append the best individual from the old population to the new population.
    For each individual in the old population:
        Create a new individual by randomly selecting and crossing two parents from the old population.
        Mutate the new individual if a random number is less than the mutation rate.
        Append the new individual to the new population.
    Transition to the new population.
'''
def evolve(self):
    for generation in range(self.max_generations):
        # Calculate the fitness scores for each individual in the population.
        fitness_scores = self.fitness_function(self.population)

        # Sort the population by fitness scores.
        sorted_population = [x for _, x in sorted(zip(fitness_scores, self.population), key=lambda pair: pair[0])]

        # Create an empty new population.
        new_population = []

        # Append the best individual from the old population to the new population.
        new_population.append(sorted_population[0])

        # For each individual in the old population:
        for individual in sorted_population[1:]:
            # Create a new individual by randomly selecting and crossing two parents from the old population.
            parents = random.sample(sorted_population, 2)
            new_individual = crossover(parents[0], parents[1])

            # Mutate the new individual if a random number is less than the mutation rate.
            if random.random() < self.mutation_rate:
                new_individual = mutate(new_individual)

            # Append the new individual to the new population.
            new_population.append(new_individual)

        # Transition to the new population.
        self.population = new_population
```


## Step 4: Generation of Genetic Functions?

The final step is to generate the `crossover` and `mutate` operations. At this point, we are already aware of the Github Copilot abilities. Therefore, the question I will target is: What type of crossover and mutation techniques can it generate? Can it generate multiple point mutations? Long story short, it can develop quite a few different techniques (at least to some point). Sometimes during mutation, it was challenging to ensure what operation we are trying to do. I will leave here one example for each of the generated mutations and recombination.

### Mutations
```python
'''
    Mutate an individual by randomly swapping two genes.
'''
def mutate(self, individual):
    # Create a copy of the individual.
    new_individual = individual[:]

    # Randomly select two genes to swap.
    gene_1 = random.randint(0, len(individual) - 1)
    gene_2 = random.randint(0, len(individual) - 1)

    # Swap the genes.
    new_individual[gene_1], new_individual[gene_2] = new_individual[gene_2], new_individual[gene_1]

    return new_individual
```

### Crossovers
```python
'''
    Cross over two parents to create a child with half the genes of each parent.
'''
def crossover(self, parent1, parent2):
    # Create a new individual.
    individual = []

    # For each gene in the parent:
    for gene1, gene2 in zip(parent1, parent2):
        # If the genes are the same, add the gene to the new individual.
        if gene1 == gene2:
            individual.append(gene1)

        # Otherwise, randomly choose one of the genes to add to the new individual.
        else:
            individual.append(random.choice([gene1, gene2]))

    # Return the new individual.
    return individual
```
## Overview
Github Copilot seems helpful in help to automate many of the more straightforward tasks. But, to answer the question, can it evolve? In my opinion, we have not reached that point yet. Unfortunately, even with the more straightforward tasks, I am forced to review multiple times the generated code to ensure it follows the described behavior. Plus, Github Copilot does not consider the interactions between the synthesized methods, allowing the generation of code that will most surely give runtime exceptions. Hopefully, with the increased automation and introduction of novel techniques in program synthesis, we will, one day, have a system that allows the development of evolutionary algorithms with ease.

