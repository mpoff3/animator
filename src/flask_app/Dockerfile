FROM manimcommunity/manim:latest

USER root

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN pip install -r requirements.txt

USER root


# Run the app when container starts
CMD ["python", "app.py"]

USER root
