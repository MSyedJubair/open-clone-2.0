import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { default as Pusher } from "pusher-js"
import { useEffect } from "react";
import { toast } from "sonner";

export function useInitiatePusher(projectId: number) {
    const trpc = useTRPC()
    const queryclient = useQueryClient()

    const projectQueryKey = trpc.project.getProject.queryKey({ projectId: projectId })
    const messageQueryKey = trpc.message.getMessages.queryKey({ projectId: projectId })

    useEffect(() => {
        const pusher = new Pusher(
            process.env.NEXT_PUBLIC_PUSHER_KEY!,
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            }
        )

        const channel = pusher.subscribe(projectId.toString());
        console.log('Done Subscribe')

        type data = { text: string, timeStamp: number, status: string }

        channel.bind('build-status', (data: data) => {
            console.log(data)
            if (data.status === 'generating') {
                toast('Building the project. You can close your browser or do something else.')

            } else if (data.status === 'completed') {
                toast('Generation completed. Updating your project...')
                queryclient.invalidateQueries({ queryKey: projectQueryKey })
                queryclient.invalidateQueries({ queryKey: messageQueryKey })

            } else if (data.status === 'failed') {
                toast('Generation failed. Please try again later.')
                queryclient.invalidateQueries({ queryKey: projectQueryKey })
                queryclient.invalidateQueries({ queryKey: messageQueryKey })
            }
        });

        return () => {
            channel.unbind_all();
            pusher.unsubscribe(projectId.toString());
        };
    }, [projectId])
}