### How to Use?

- run docker container with command :   
    ```     
    docker run -d --hostname my-rabbit --name rabbitmq  -p 15672:15672 -p 5672:5672 rabbitmq:3-management
    ```

- open localhost:15672 in browser see queues details

- send a message fromo the send.js file
- open reveice.js file to receive the message