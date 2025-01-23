import { RiverAlertType } from "./enums";

export const emailTemplates = {
    [RiverAlertType.red]: {
        en: (region: string, organizationName: string) => `
            <h1>🔴 ⚠️ 🔴</h1>
            <p>Dear Residents,</p>
            <p>A Red Alert has been issued for the ${region} region due to dangerously high river levels. Immediate action is required to ensure your safety.</p>
            <p><strong>What you should do:</strong></p>
            <ol>
                <li>Follow evacuation orders from local authorities.</li>
                <li>Move to higher ground immediately.</li>
                <li>Do not attempt to cross flooded areas.</li>
            </ol>
            <p>This is a serious situation, and your cooperation is crucial. Stay tuned for further instructions and updates.</p>
            <p>Stay safe,</p>
            <p>${organizationName}</p>
        `,
        es: (region: string, organizationName: string) => `
            <h1>🔴 ⚠️ 🔴</h1>
            <p>Estimados Residentes,</p>
            <p>Se ha emitido una Alerta Roja para la región de ${region} debido a niveles peligrosamente altos del río. Se requiere acción inmediata para garantizar su seguridad.</p>
            <p><strong>Lo que deben hacer:</strong></p>
            <ol>
                <li>Seguir las órdenes de evacuación de las autoridades locales.</li>
                <li>Trasladarse a terrenos más altos de inmediato.</li>
                <li>No intentar cruzar áreas inundadas.</li>
            </ol>
            <p>Esta es una situación seria, y su cooperación es crucial. Estén atentos a más instrucciones y actualizaciones.</p>
            <p>Manténganse seguros,</p>
            <p>${organizationName}</p>
        `,
    },
    [RiverAlertType.yellow]: {
        en: (region: string, organizationName: string) => `
            <h1>🟡 ⚠️ 🟡</h1>
            <p>Dear Residents,</p>
            <p>A Yellow Alert has been issued for the ${region} region due to rising river levels. There is no immediate danger, but please stay informed and take precautionary measures.</p>
            <p><strong>What you should do:</strong></p>
            <ol>
                <li>Stay updated with the latest weather reports.</li>
                <li>Secure important documents and belongings.</li>
                <li>Have emergency contact numbers handy.</li>
            </ol>
            <p>We will keep you informed of any further developments.</p>
            <p>Stay safe,</p>
            <p>${organizationName}</p>
        `,
        es: (region: string, organizationName: string) => `
            <h1>🟡 ⚠️ 🟡</h1>
            <p>Estimados Residentes,</p>
            <p>Les informamos que se ha emitido una Alerta Amarilla para la región de ${region} debido al aumento del nivel del río. En esta etapa, no hay peligro inmediato, pero les recomendamos mantenerse informados y tomar medidas de precaución.</p>
            <p><strong>Lo que deben hacer:</strong></p>
            <ol>
                <li>Mantenerse al tanto de los últimos reportes meteorológicos.</li>
                <li>Asegurar documentos y pertenencias importantes.</li>
                <li>Tener a mano los números de contacto de emergencia.</li>
            </ol>
            <p>Les mantendremos informados de cualquier desarrollo adicional.</p>
            <p>Manténganse seguros,</p>
            <p>${organizationName}</p>
        `,
    },
    [RiverAlertType.orange]: {
        en: (region: string, organizationName: string) => `
            <h1>🟠 ⚠️ 🟠</h1>
            <p>Dear Residents,</p>
            <p>This is an Orange Alert for the ${region} region due to significantly rising river levels. The risk of flooding has increased, and it is essential to prepare for possible evacuation.</p>
            <p><strong>What you should do:</strong></p>
            <ol>
                <li>Monitor local news and weather updates.</li>
                <li>Prepare an emergency kit with essentials.</li>
                <li>Be ready to evacuate if necessary.</li>
            </ol>
            <p>We are monitoring the situation closely and will provide updates as needed.</p>
            <p>Stay alert and prepared,</p>
            <p>${organizationName}</p>
        `,
        es: (region: string, organizationName: string) => `
            <h1>🟠 ⚠️ 🟠</h1>
            <p>Estimados Residentes,</p>
            <p>Se ha emitido una Alerta Naranja para la región de ${region} debido a un aumento significativo en los niveles del río. El riesgo de inundación ha aumentado, y es esencial prepararse para una posible evacuación.</p>
            <p><strong>Lo que deben hacer:</strong></p>
            <ol>
                <li>Monitorear las noticias locales y las actualizaciones meteorológicas.</li>
                <li>Preparar un kit de emergencia con lo esencial.</li>
                <li>Estar listos para evacuar si es necesario.</li>
            </ol>
            <p>Estamos monitoreando la situación de cerca y proporcionaremos actualizaciones según sea necesario.</p>
            <p>Manténganse alerta y preparados,</p>
            <p>${organizationName}</p>
        `,
    },
};