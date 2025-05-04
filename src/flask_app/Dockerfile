FROM manimcommunity/manim:latest

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app

# Create venv and install dependencies in one step
RUN uv venv && \
    /bin/bash -c "source .venv/bin/activate && \
    uv pip install -e ."

# Expose port 5000
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py

# Run the app when container starts
CMD ["/bin/bash", "-c", "source .venv/bin/activate && python app.py"]

