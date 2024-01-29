import random
import statistics
import time

time_list=[]
trials=0
success=0
max_generation=10000
attacks=[]

def random_chromosome(size): #making random chromosomes
    return [ random.randint(1, nq) for _ in range(nq) ]

def fitness(chromosome):    #calculate # of non-attacking pairs
    horizontal_collisions = sum([chromosome.count(queen)-1 for queen in chromosome])/2
    diagonal_collisions = 0

    n = len(chromosome)
    left_diagonal = [0] * 2*n
    right_diagonal = [0] * 2*n
    for i in range(n):
        left_diagonal[i + chromosome[i] - 1] += 1
        right_diagonal[len(chromosome) - i + chromosome[i] - 2] += 1

    diagonal_collisions = 0
    for i in range(2*n-1):
        counter = 0
        if left_diagonal[i] > 1:
            counter += left_diagonal[i]-1
        if right_diagonal[i] > 1:
            counter += right_diagonal[i]-1
        diagonal_collisions += counter / (n-abs(i-n+1))

    return int(maxFitness - (horizontal_collisions + diagonal_collisions)) #28-(2+3)=23

def probability(chromosome, fitness):
    return fitness(chromosome) / maxFitness

def random_pick(population, probabilities): #roulette wheel
    populationWithProbabilty = zip(population, probabilities)
    total = sum(w for _, w in populationWithProbabilty)
    r = random.uniform(0, total)
    upto = 0
    for c, w in zip(population, probabilities):
        if upto + w >= r:
            return c
        upto += w

def reproduce(x, y): #doing cross_over between two chromosomes(1-point xover)
    n = len(x)
    c = random.randint(0, n - 1)
    return x[:c] + y[c:], y[:c] + x[c:]

def mutate(x):  #randomly changing the value of a random index of a chromosome
    n = len(x)
    x[random.randint(0, n - 1)] = random.randint(1, n)
    return x

def genetic_queen(population, fitness): #generational model
    global success

    mutation_probability = 0.1  #0.03
    new_population = []
    probabilities = [probability(n, fitness) for n in population]
    for i in range(len(population)):
        x = random_pick(population, probabilities) #best chromosome 1
        y = random_pick(population, probabilities) #best chromosome 2
        child1, child2 = reproduce(x, y) #creating two new chromosomes from the best 2 chromosomes
        if random.random() < mutation_probability:
            child1 = mutate(child1)
            child2 = mutate(child2)
        #print_chromosome(child)
        if fitness(child1) >= fitness(child2):
            new_population.append(child1)
        else:
            new_population.append(child2)
        if fitness(child1) == maxFitness or fitness(child2)==maxFitness:
            success+=1
            break  #find optimal sol
    return new_population

def print_chromosome(chrom):
    print("Chromosome = {},  Fitness = {}".format(str(chrom), fitness(chrom)))

if __name__ == "__main__":
    nq = int(input("Enter Number of Queens: ")) #say N = 8

    for i in range(30):
        print(f"Round {i+1}:")
        start=time.time()

        maxFitness = (nq*(nq-1))/2  # C(8,2) = 8*7/2 = 28
        population = [random_chromosome(nq) for _ in range(100)]    #population size=100
        generation = 1

        while maxFitness not in [fitness(chrom) for chrom in population] and generation<max_generation:
            trials+=1

            population = genetic_queen(population, fitness)
            if generation%1000==0:
                print("=== Generation {} ===".format(generation))
                print("Maximum Fitness = {}".format(max([fitness(n) for n in population])))

            generation += 1

        chrom_out = []  #a copy of best chrom
        best_fitness = -1
        print("\nEnd in Generation {}!".format(generation-1))
        for chrom in population:
            #if fitness(chrom) == maxFitness:
            current_fitness = fitness(chrom)
            if current_fitness > best_fitness:
                best_fitness = current_fitness
                chrom_out = chrom

        print("One of the solutions: ")
        print_chromosome(chrom_out)
        attacks.append(int(maxFitness - fitness(chrom_out)))
        #print(attacks)

        board = []

        for x in range(nq):
            board.append(["x"] * nq)

        for i in range(nq):
            board[nq-chrom_out[i]][i]="Q"

        def print_board(board):
            for row in board:
                print (" ".join(row))

        print()
        print_board(board)

        end=time.time()
        time_list.append(end-start)
        print("==========")

print(f"Average time = {statistics.mean(time_list)} sec")
#print(f"success rate = {success/trials}")
print(f"Average num of attacking pairs = {statistics.mean(attacks)}")
print(f"success cnt = {success}")