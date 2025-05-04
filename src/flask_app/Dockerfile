FROM manimcommunity/manim:latest



# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN pip install -r requirements.txt


# Run the app when container starts
CMD ["python", "app.py"]
