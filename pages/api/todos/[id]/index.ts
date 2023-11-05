import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === "DELETE") {
        await todoController.deleteById(request, response);
        return;
    }

    response.status(405).json({
        message: "method now allowed",
    });
}
