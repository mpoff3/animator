# animator

The goal of this project is to creat an way to create math visualizations in Manim using an LLM. The baisc UI will look like thhis:

![docs/ui-mockup.png](docs/ui-mockup-v0.png)

The essential idea of the flow of the system is:

- A user enters a math quetsion in a chat box. To start, we will always default to "How do you multiply a matrix by a vector?"
- The users question is passed to an LLM angent for expansion. The goal of this is to create a text explanation interspersed with animations where appropriate.
- Once this initial text is generated it is passed to a second LLM agent that will create one or more manim scripts. Each script will be posted to a docker container that will generate an mp4 that is dropped onto a bucket.

```mermaid
flowchart TD
    A[User] -->|Enters math question| B[Chat Interface]
    B -->|Submits question| Q1[(Request Queue)]

    subgraph "Async Processing"
        Q1 -.->|Picks up request| C[LLM Agent 1]
        C -.->|Generates explanation| Q2[(Processing Queue)]
        Q2 -.->|Picks up task| D[LLM Agent 2]
        D -.->|Creates scripts| Q3[(Script Queue)]
        Q3 -.->|Distributes to available container| E1[Docker Container 1]
        Q3 -.->|Distributes to available container| E2[Docker Container 2]
        Q3 -.->|Distributes to available container| E3[Docker Container 3]

        E1 -.->|Renders video| F[(Storage Bucket)]
        E2 -.->|Renders video| F
        E3 -.->|Renders video| F
    end

    F -->|Notifies when ready| N[Notification Service]
    N -->|Alerts| B
    F -.->|Retrieves videos| H[UI Display]
    H -->|Shows results| A

    classDef user fill:#f9d, stroke:#333, stroke-width:2px
    classDef interface fill:#bbf, stroke:#333, stroke-width:1px
    classDef agent fill:#bfb, stroke:#333, stroke-width:1px
    classDef process fill:#fbb, stroke:#333, stroke-width:1px
    classDef storage fill:#ddd, stroke:#333, stroke-width:1px
    classDef queue fill:#fcf, stroke:#333, stroke-width:1px, stroke-dasharray: 5 5

    class A user
    class B,H interface
    class C,D agent
    class E1,E2,E3 process
    class F,Q1,Q2,Q3 storage
    class N interface
    class Q1,Q2,Q3 queue
```

## Dev setup

```
uv venv --python=3.10
source .venv/bin/activate
uv pip install -e .
```

You also need latex

### Building and running with docker

```
docker build -t mathlens .
```

docker run -p 5000:5000 \
 -v $(pwd):/app \
   -e OPENAI_API_KEY=$OPENAI_API_KEY \
 mathlens
