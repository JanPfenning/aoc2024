import json
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.widgets import Button, Slider

with open('iterations.data.json', 'r') as file:
    data = json.load(file)
    print("iterations: ", len(data))
    print("guards: ", len(data[0]))

# Initialize the plot
fig, ax = plt.subplots(figsize=(10, 10))
ax.set_title('Iteration 0')
plt.subplots_adjust(bottom=0.25)

grid_size = 106
grid = np.ones((grid_size, grid_size))
im = ax.imshow(grid, cmap='binary', interpolation='nearest', vmin=0, vmax=1)

ax.set_xticks(np.arange(-.5, grid_size, 1), minor=True)
ax.set_yticks(np.arange(-.5, grid_size, 1), minor=True)
ax.grid(which="minor", color="white", linestyle='-', linewidth=2)

plt.xlim(0, 105)
plt.gca().invert_yaxis()
plt.ylim(105, 0)
plt.grid(True)

# Animation control variables
current_frame = 0
animation_speed = 500  # in milliseconds
animation_running = False

def update_plot(frame):
    # Create a new empty grid for each frame
    grid = np.zeros((106, 106))
    
    # Highlight the specific coordinates for this frame
    for coord in data[frame]:
        x, y = coord
        grid[y][x] = 1
    
    im.set_array(grid)
    ax.set_title(f'Iteration {frame}')
    fig.canvas.draw_idle()

def animate(direction):
    global current_frame, animation_running
    if direction == 'forward':
        current_frame += 1
    elif direction == 'backward':
        current_frame -= 1
    current_frame = current_frame % len(data)
    update_plot(current_frame)
    if animation_running:
        plt.pause(animation_speed / 1000)
        animate(direction)

def play_pause(event):
    global animation_running
    animation_running = not animation_running
    if animation_running:
        animate('forward')

def on_slider_change(val):
    global current_frame
    current_frame = int(val)
    update_plot(current_frame)

# Create buttons
ax_play = plt.axes([0.7, 0.05, 0.1, 0.075])
btn_play = Button(ax_play, 'Play/Pause')
btn_play.on_clicked(play_pause)

ax_prev = plt.axes([0.81, 0.05, 0.1, 0.075])
btn_prev = Button(ax_prev, 'Previous')
btn_prev.on_clicked(lambda x: animate('backward'))

ax_next = plt.axes([0.92, 0.05, 0.1, 0.075])
btn_next = Button(ax_next, 'Next')
btn_next.on_clicked(lambda x: animate('forward'))

# Create slider for iteration selection
ax_slider = plt.axes([0.1, 0.05, 0.5, 0.03])
slider = Slider(ax_slider, 'Iteration', 0, len(data) - 1, valinit=0, valstep=1)
slider.on_changed(on_slider_change)

# Create slider for animation speed
ax_speed = plt.axes([0.1, 0.1, 0.5, 0.03])
speed_slider = Slider(ax_speed, 'Delay', 1, 1000, valinit=animation_speed)
speed_slider.on_changed(lambda val: globals().update(animation_speed=val))

update_plot(0)
plt.show()
