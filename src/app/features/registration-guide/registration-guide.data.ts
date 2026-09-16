export type GuideLanguage = 'en' | 'pt';

export interface GuideCopy {
  title: string;
  eyebrow: string;
  explanation: string;
  action?: string;
  note?: string;
}

export interface RegistrationGuideStep {
  slug: string;
  image: string;
  imageAlt: Record<GuideLanguage, string>;
  kind: 'intro' | 'step' | 'error' | 'success';
  copy: Record<GuideLanguage, GuideCopy>;
}

export const REGISTRATION_GUIDE_STEPS: RegistrationGuideStep[] = [
  {
    slug: 'welcome',
    image: '/assets/registration-guide/welcome.svg',
    kind: 'intro',
    imageAlt: {
      en: 'Two browser tabs, one for this guide and one for registration',
      pt: 'Duas abas, uma para este guia e outra para o cadastro',
    },
    copy: {
      en: {
        title: 'Keep this guide nearby',
        eyebrow: 'Before you begin',
        explanation:
          'Open registration in a second tab. Read one short step here, then switch back to complete it.',
        action: 'Keep both tabs open',
        note: 'Your place is saved automatically.',
      },
      pt: {
        title: 'Mantenha este guia por perto',
        eyebrow: 'Antes de começar',
        explanation:
          'Abra o cadastro em uma segunda aba. Leia uma etapa aqui e volte para concluí-la.',
        action: 'Mantenha as duas abas abertas',
        note: 'Seu progresso é salvo automaticamente.',
      },
    },
  },
  {
    slug: 'personal-details',
    image: '/assets/registration-guide/personal-details.svg',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese personal details screen with name and document fields highlighted',
      pt: 'Tela de dados pessoais com os campos nome e documento destacados',
    },
    copy: {
      en: {
        title: 'Enter your details',
        eyebrow: 'Personal details',
        explanation: 'Type your full name in “Nome completo” and your document number in “CPF”.',
        action: 'Tap “Continuar”',
        note: 'Use the same details shown on your document.',
      },
      pt: {
        title: 'Informe seus dados',
        eyebrow: 'Dados pessoais',
        explanation:
          'Digite seu nome completo em “Nome completo” e o número do documento em “CPF”.',
        action: 'Toque em “Continuar”',
        note: 'Use os mesmos dados do seu documento.',
      },
    },
  },
  {
    slug: 'phone-code',
    image: '/assets/registration-guide/phone-code.svg',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese verification screen with six-digit code field highlighted',
      pt: 'Tela de verificação com campo do código de seis dígitos destacado',
    },
    copy: {
      en: {
        title: 'Confirm your phone',
        eyebrow: 'Security code',
        explanation: 'Enter the 6-digit code sent by text message in “Código de verificação”.',
        action: 'Tap “Confirmar”',
        note: 'The code can take a minute to arrive.',
      },
      pt: {
        title: 'Confirme seu celular',
        eyebrow: 'Código de segurança',
        explanation: 'Digite em “Código de verificação” os 6 números recebidos por SMS.',
        action: 'Toque em “Confirmar”',
        note: 'O código pode levar um minuto para chegar.',
      },
    },
  },
  {
    slug: 'face-scan',
    image: '/assets/registration-guide/face-scan.svg',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese facial verification screen showing a face inside an oval',
      pt: 'Tela de verificação facial mostrando um rosto dentro de um oval',
    },
    copy: {
      en: {
        title: 'Get ready before switching',
        eyebrow: 'Face scan',
        explanation:
          'Move to a bright place. Remove glasses or a hat, clean the front camera, and keep your face fully visible.',
        action: 'Switch tabs, then tap “Iniciar”',
        note: 'Stay in the camera flow until it finishes.',
      },
      pt: {
        title: 'Prepare-se antes de voltar',
        eyebrow: 'Reconhecimento facial',
        explanation:
          'Vá para um lugar claro. Tire óculos ou boné, limpe a câmera frontal e deixe o rosto visível.',
        action: 'Volte à outra aba e toque em “Iniciar”',
        note: 'Permaneça na câmera até concluir.',
      },
    },
  },
  {
    slug: 'review',
    image: '/assets/registration-guide/review.svg',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese review screen with the confirm button highlighted',
      pt: 'Tela de revisão com o botão confirmar destacado',
    },
    copy: {
      en: {
        title: 'Check and submit',
        eyebrow: 'Final check',
        explanation:
          'Review your name, document and phone. Go back in registration if anything is wrong.',
        action: 'Tap “Confirmar cadastro”',
      },
      pt: {
        title: 'Revise e envie',
        eyebrow: 'Conferência final',
        explanation:
          'Confira nome, documento e celular. Volte no cadastro se algo estiver incorreto.',
        action: 'Toque em “Confirmar cadastro”',
      },
    },
  },
  {
    slug: 'invalid-code',
    image: '/assets/registration-guide/invalid-code.svg',
    kind: 'error',
    imageAlt: {
      en: 'Portuguese invalid-code error message',
      pt: 'Mensagem de erro de código inválido',
    },
    copy: {
      en: {
        title: 'Code not accepted?',
        eyebrow: 'Troubleshooting',
        explanation:
          'Check that you entered the newest 6-digit code. Older codes stop working after you request another.',
        action: 'Tap “Reenviar código”',
        note: 'Wait one minute before requesting again.',
      },
      pt: {
        title: 'Código não aceito?',
        eyebrow: 'Solução de problemas',
        explanation:
          'Confira se digitou o código mais recente. Códigos antigos deixam de funcionar após um novo pedido.',
        action: 'Toque em “Reenviar código”',
        note: 'Espere um minuto antes de pedir novamente.',
      },
    },
  },
  {
    slug: 'camera-error',
    image: '/assets/registration-guide/camera-error.svg',
    kind: 'error',
    imageAlt: {
      en: 'Portuguese camera permission error message',
      pt: 'Mensagem de erro de permissão da câmera',
    },
    copy: {
      en: {
        title: 'Camera not opening?',
        eyebrow: 'Troubleshooting',
        explanation:
          'Allow camera access in your browser settings, close other apps using the camera, then return to registration.',
        action: 'Tap “Tentar novamente”',
        note: 'Do not use a private browsing tab.',
      },
      pt: {
        title: 'A câmera não abre?',
        eyebrow: 'Solução de problemas',
        explanation:
          'Permita o acesso à câmera no navegador, feche outros apps que usam a câmera e volte ao cadastro.',
        action: 'Toque em “Tentar novamente”',
        note: 'Não use uma aba anônima.',
      },
    },
  },
  {
    slug: 'complete',
    image: '/assets/registration-guide/complete.svg',
    kind: 'success',
    imageAlt: {
      en: 'Portuguese registration completed screen with a check mark',
      pt: 'Tela de cadastro concluído com marca de confirmação',
    },
    copy: {
      en: {
        title: 'You’re all set',
        eyebrow: 'Registration complete',
        explanation:
          'When you see “Cadastro concluído”, your information has been sent successfully.',
        action: 'You can close this guide',
      },
      pt: {
        title: 'Tudo pronto',
        eyebrow: 'Cadastro concluído',
        explanation:
          'Quando aparecer “Cadastro concluído”, suas informações foram enviadas com sucesso.',
        action: 'Você pode fechar este guia',
      },
    },
  },
];
