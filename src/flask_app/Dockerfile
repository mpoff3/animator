FROM manimcommunity/manim:latest

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies directly without virtual environment
RUN uv pip install -e .

# Expose port 5000
EXPOSE 5000

# Run the app when container starts
CMD ["python", "app.py"]
