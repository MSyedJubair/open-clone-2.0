"use client"

import ProjectChat from '../ProjectChat/ProjectChatView'
import CodeStudio from '../Code Studio/Code Studio'
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const ProjectView = ({ projectId }: { projectId: number }) => {
    return (
        <Allotment>
            <Allotment.Pane minSize={280} maxSize={500} snap>
                <ProjectChat projectId={projectId} />
            </Allotment.Pane>

            <Allotment.Pane>
                <CodeStudio projectId={projectId}/>
            </Allotment.Pane>
        </Allotment>
    )
}

export default ProjectView