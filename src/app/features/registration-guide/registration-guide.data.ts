export type GuideLanguage = 'en' | 'pt';

export interface GuideCopy {
  title?: string;
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
    image: '/assets/registration-guide/inicio.png',
    kind: 'intro',
    imageAlt: {
      en: 'Two browser tabs, one for this guide and one for registration',
      pt: 'Duas abas, uma para este guia e outra para o cadastro',
    },
    copy: {
      en: {
        title: 'Guide to biometric registration',
        explanation:
          'Open registration in a second tab. Read one short step here, then switch back to complete it.',
        action: 'Click the blue button',
        note: 'Your progress is saved automatically.',
      },
      pt: {
        title: 'Guia para o registro facial',
        explanation:
          'Abra o cadastro em uma segunda aba. Leia uma etapa curta aqui e depois volte para concluir essa etapa.',
        action: 'Clique o botão azul',
        note: 'Seu progresso é salvo automaticamente.',
      },
    },
  },
  {
    slug: 'acesso-facial',
    image: '/assets/registration-guide/acesso-facial.png',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese personal details screen with name and document fields highlighted',
      pt: 'Tela de dados pessoais com os campos nome e documento destacados',
    },
    copy: {
      en: {
        title: 'Start registration process',
        explanation: 'You will now take a selfie that will be uploaded to the digital concierge service',
        action: 'Click the blue button',
      },
      pt: {
        title: 'Começa o registro facial',
        explanation:
          'Agora você vai tirar uma selfie, que será enviada para o serviço de portaria digital',
        action: 'Clique o botão azul',
      },
    },
  },
  {
    slug: 'selfie',
    image: '/assets/registration-guide/selfie.png',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese verification screen with six-digit code field highlighted',
      pt: 'Tela de verificação com campo do código de seis dígitos destacado',
    },
    copy: {
      en: {
        title: 'Selfie instructions',
        explanation: 'Move to a bright place. Remove glasses or a hat, clean the front camera, and keep your face fully visible.',
        action: 'Click the blue button',
      },
      pt: {
        explanation: 'Leia as instruções com atenção',
        action: 'Clique o botão azul',
      },
    },
  },
  {
    slug: 'centralize',
    image: '/assets/registration-guide/centralize.png',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese facial verification screen showing a face inside an oval',
      pt: 'Tela de verificação facial mostrando um rosto dentro de um oval',
    },
    copy: {
      en: {
        explanation:
          'Keep your head centrally in the oval',
      },
      pt: {
        explanation:
          'Siga sempre as instruções fornecidas',
      },
    },
  },
  {
    slug: 'vire',
    image: '/assets/registration-guide/vire.png',
    kind: 'step',
    imageAlt: {
      en: 'Portuguese review screen with the confirm button highlighted',
      pt: 'Tela de revisão com o botão confirmar destacado',
    },
    copy: {
      en: {
        title: 'Register your face',
        explanation:
          'Turn your head towards the indicated direction',
        action: 'Continue the process until you see the next screen',
      },
      pt: {
        title: 'Registro facial',
        explanation: 'Vire a cabeça na direção indicada',
        action:
          'Continue o processo até ver a próxima tela',
      },
    },
  },
  {
    slug: 'confirmar',
    image: '/assets/registration-guide/confirmar.png',
    kind: 'error',
    imageAlt: {
      en: 'Portuguese invalid-code error message',
      pt: 'Mensagem de erro de código inválido',
    },
    copy: {
      en: {
        explanation:
          'Confirm your selfie',
        action: 'Click “Enviar” to upload your selfie to the digital concierge',
        note: 'If your are not happy with your photo, click “Refazer” to try again',
      },
      pt: {
        explanation: 'Confirme sua selfie',
        action:
          'Clique em “Enviar” para enviar sua selfie à portaria digital',
        note: 'Se você não estiver satisfeito com a foto, clique em “Refazer” para tentar novamente.',
      },
    },
  },
  {
    slug: 'sucesso',
    image: '/assets/registration-guide/sucesso.png',
    kind: 'error',
    imageAlt: {
      en: 'Portuguese camera permission error message',
      pt: 'Mensagem de erro de permissão da câmera',
    },
    copy: {
      en: {
        title: 'Registration complete',
        explanation:
          'If you see this screen, the biometric registration has been completed successfully',
        action: 'See next step, if you do not get this screen',
      },
      pt: {
        title: 'Cadastro concluído',
        explanation:
          'Se você vir esta tela, o cadastro biométrico foi concluído com sucesso',
        action: 'Veja a próxima etapa caso esta tela não apareça',
      },
    },
  },
  {
    slug: 'error',
    image: '/assets/registration-guide/error.png',
    kind: 'success',
    imageAlt: {
      en: 'Portuguese registration completed screen with a check mark',
      pt: 'Tela de cadastro concluído com marca de confirmação',
    },
    copy: {
      en: {
        title: 'Something went wrong?',
        explanation:
          'If you get this message, something went wrong. Please try again, until you sucessfully register your face',
        action: 'Go back to step one of guide',
      },
      pt: {
        title: 'Algo deu errado?',
        explanation:
          'Se você receber esta mensagem, algo deu errado. Tente novamente até conseguir cadastrar seu rosto com sucesso',
        action: 'Volte para a primeira etapa do guia',
      },
    },
  },
];
