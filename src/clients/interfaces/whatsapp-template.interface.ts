export interface SendMessageTemplateOptions {
    to: string;
    templateName: string;
    languageCode: string;
    components: TemplateComponent[];
}

export interface TemplateComponent {
    type: string;
    parameters: TemplateParameter[];
}

export interface TemplateParameter {
    type: string;
    text: string;
}