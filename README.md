# Nodejs Monitoring

This is an example Node.js application. This application creates REST APIs using Express.js and monitors the application through Prometheus and Grafana.

## Getting Started

These instructions will help you to run the project on your local machine.

### Prerequisites

To run this project locally, you must have the following software components installed:

- Node.js
- Docker and Docker Compose

### Installation

Follow the below steps to run this project on your local machine:

1. Clone the repository to your local machine.
2. Open the terminal and navigate to the root directory of the project.
3. Run the command `npm install`.
4. Run the command `npm start`.

Alternatively, if you want to run the project on Docker, follow the below steps:

1. Clone the repository to your local machine.
2. Open the terminal and navigate to the root directory of the project.
3. Run the command `docker-compose up`.

## Usage

After running this project locally, you can access its REST APIs at `http://localhost:3000`.

## Monitoring

You can monitor this project through Prometheus and Grafana. Prometheus runs at `http://localhost:9090`, while Grafana runs at `http://localhost:3001`. Additionally, you can find ready-to-use Grafana dashboard templates in the `metrics` folder in the project. You can import these templates into Grafana and use them to monitor the metrics of your Node.js application.

To import a template in Grafana, follow these steps:

1.  Open the Grafana web interface at `http://localhost:3001`.
2.  Click on the "+" icon in the left menu and select "Import".
3.  In the "Import" section, click on the "Upload JSON File" button and select a JSON file from the `metrics` folder.
4.  Configure the dashboard settings as needed and click on the "Import" button.

After importing the template, you will have a fully functional Grafana dashboard to monitor your Node.js application.


## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
