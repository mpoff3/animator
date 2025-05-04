FROM manimcommunity/manim:latest

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
RUN uv venv
RUN source .venv/bin/activate
RUN uv pip install -e .


#CMD ["uv", "run", "app.py"]




