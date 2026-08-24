import type { SchemaTypeDefinition } from "sanity";
import { aboutPageType } from "./aboutPage";
import { photoSessionType } from "./photoSession";
import { videoProjectType } from "./videoProject";

export const schemaTypes: SchemaTypeDefinition[] = [
  photoSessionType,
  videoProjectType,
  aboutPageType,
];
