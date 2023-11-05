import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === "GET" && 
        request.query.limit && 
        request.query.page) {

        todoController.getWithPagination(request, response)
        return;
    }

    response.status(405).json({
        message: "method now allowed",
    });
}
