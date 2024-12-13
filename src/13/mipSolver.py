import re
from mip import Model, minimize, INTEGER

def read_file(file_name):
    with open(file_name, 'r') as file:
        content = file.read()
        chunks = content.split('\n\n')

        parsed_machines = []

        for chunk in chunks:
            lines = chunk.strip().split('\n')
            triple = []
            for line in lines:
                numbers = re.findall(r'\d+', line)
                pair = (int(numbers[0]), int(numbers[1]))
                triple.append(pair)
            parsed_machines.append(tuple(triple))

        return parsed_machines

def solve(a, b, x):
    model = Model()

    aPresses = model.add_var(var_type=INTEGER, lb=0, name="aPresses")
    bPresses = model.add_var(var_type=INTEGER, lb=0, name="bPresses")

    (xValA, yValA), (xValB, yValB), (xTarget, yTarget) = a, b, x

    model += xValA * aPresses + xValB * bPresses == xTarget
    model += yValA * aPresses + yValB * bPresses == yTarget

    model.objective = minimize(3 * aPresses + bPresses)

    model.optimize()

    if model.num_solutions:
        # print(f"aPresses: {aPresses.x}")
        # print(f"bPresses: {bPresses.x}")
        # print(f"Objective value: {model.objective_value}")
        return model.objective_value
    else:
        # print("No solution found")
        return False

def main():
    example = False
    part1 = False
    shift = 1 if part1 else 10000000000000
    machines = read_file("example_input.txt" if example else "puzzle_input.txt")
    res = [solve(machine[0], machine[1], [x + shift for x in machine[2]]) for machine in machines]
    print(sum([x for x in res if not isinstance(x, bool)]))

if __name__ == "__main__":
    main()

