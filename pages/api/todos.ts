import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === "GET") {
        await todoController.get(request, response);
        return;
    }

    if (request.method === "POST") {
        console.log(request.body);
        await todoController.create(request, response);
        return;
    }

    response.status(405).json({
        message: "method now allowed",
    });
}