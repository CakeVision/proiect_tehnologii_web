import { Tags } from "../models/tags.model";
import { Task } from "../models/task.model";
import { TagLink } from "../models/tag_link.model";

function validateParams(params:object):Array<string>{
    return Object.values(params).filter(param => 
        param != null);
}

export class TagController {
    async create(req, res){
        const {
            name = undefined,
            color = undefined,
        } = req.body
        const validParams = validateParams({name,color})
        if(validParams.length <2){
            return res.status(400).json({
                "status": "Missing Non-optional Params",
                "message": `Provide at least one of ${Object.keys(validParams).join(', ')}`,
            });
        }
        const newTag = await Tags.create(name,color);
        return res.status(200).json({
            "message": `Creation Succesful`,
            "task": newTag
        });
    }

    async alter(req,res){
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                "status": "Missing Non-optional Params",
                "message": `Missing valid id`,
            });
        }
        const {name = undefined, color=undefined} = req.body
        const tag = Tags.findByPk(id);
        const validParams = validateParams({name,color})
        }
    }
}