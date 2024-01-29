from random import randint
import time
import statistics

N = 50
attacking_list=[]	#list of ints(attacking pairs)
time_list=[]
trials=0
success=0

def configureRandomly(board, state):
	for i in range(N):
		state[i] = randint(0,N-1)	#[0,N-1]
		board[state[i]][i] = 1

def printBoard(board):
	for i in range(N):
		print(*board[i])

def compareStates(state1, state2):
	for i in range(N):
		if (state1[i] != state2[i]):
			return False
	return True

def fill(board, value):
	for i in range(N):
		for j in range(N):
			board[i][j] = value

#count num of attacking pairs given state[]
def heuristic(board, state):
	cnt=0
	for i in range(N):
		for j in range(i+1,N):
			if i!=j:
				rowi=state[i];coli=i
				rowj=state[j];colj=j
				if rowi==rowj or coli==colj or abs(rowi-rowj)==abs(coli-colj):
					cnt+=1
	return cnt

# once we have state, we can plot the board
def generateBoard(board, state):
	fill(board, 0)
	for i in range(N):
		board[state[i]][i] = 1

def copyState(state1, state2):
	for i in range(N):
		state1[i] = state2[i]

def getBestNeighbour(board, state):
	global trials
	trials+=1
	opBoard = [[0 for _ in range(N)] for _ in range(N)]	#optimal board
	opState = [0 for _ in range(N)]	#optimal state

	copyState(opState, state)
	generateBoard(opBoard, opState)

	opHeuristic = heuristic(opBoard, opState)	#optimal heuristic

	# temp board and state for the purpose of computation
	NeighbourBoard = [[0 for _ in range(N)] for _ in range(N)]
	NeighbourState = [0 for _ in range(N)]
	copyState(NeighbourState, state)
	generateBoard(NeighbourBoard, NeighbourState)

	#create neighbors
	for i in range(N):	#for every col
		for j in range(N):	#for every row
			if j != state[i]:	#skip current state
				# move the queen to other row on col i
				NeighbourState[i] = j
				NeighbourBoard[NeighbourState[i]][i] = 1
				NeighbourBoard[state[i]][i] = 0

				# Calculating the objective value of the neighbour
				temp = heuristic(NeighbourBoard, NeighbourState)

				# if temporary heuristic < optimal then updating accordingly.
				if (temp <= opHeuristic):
					opHeuristic = temp
					copyState(opState, NeighbourState)
					generateBoard(opBoard, opState)

				# recover the board
				NeighbourBoard[NeighbourState[i]][i] = 0
				NeighbourState[i] = state[i]
				NeighbourBoard[state[i]][i] = 1

	#copy opState(the best state) to state
	copyState(state, opState)
	generateBoard(board, state)

def hillClimbing(board, state):
	global success
	neighbourBoard = [[0 for _ in range(N)] for _ in range(N)]
	neighbourState = [0 for _ in range(N)]

	copyState(neighbourState, state)
	generateBoard(neighbourBoard, neighbourState)

	while True:

		# Copying the neighbour board and
		# state to the current board and
		# state, since a neighbour
		# becomes current after the jump.

		copyState(state, neighbourState)
		generateBoard(board, state)

		# Getting the optimal neighbour
		getBestNeighbour(neighbourBoard, neighbourState)

		if(heuristic(board,state)==0):
			success+=1

		if compareStates(state, neighbourState):

			# If neighbour and current are
			# equal then no optimal neighbour
			# exists and therefore output the
			# result and break the loop.

			printBoard(board)	# ans need this
			print(state)
			attacking_cnt=heuristic(board,state)
			print(f"# attacking pairs = {attacking_cnt}")
			attacking_list.append(attacking_cnt)
			break
		elif heuristic(board, state) == heuristic(neighbourBoard, neighbourState):
			# If neighbour and current are not equal but their objectives are equal
			# => shoulder or  local optimum => jump to a random neighbour to escape it.

			# Random neighbour
			neighbourState[randint(0,N-1)] = randint(0,N-1)
			generateBoard(neighbourBoard, neighbourState)


for i in range(30):
	print(f"Round {i+1}:")
	start=time.time()

	# state[i]=j means there is a queen at column index i and row index j
	state = [0] * N
	board = [[0 for _ in range(N)] for _ in range(N)]

	# Getting a starting point by randomly configuring the board
	configureRandomly(board, state)
	hillClimbing(board, state)

	'''if i==30-1:
		printBoard(board)'''

	end=time.time()
	time_list.append(end-start)
	print("==========")
print(f"Average num of attacking pairs = {statistics.mean(attacking_list)}")
print(f"Average time = {statistics.mean(time_list)} sec")
#print(f"success rate = {success/trials}")
print(f"success cnt = {success}")