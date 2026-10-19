/* ============================================
   MIRAS FIXAS DO SITE
   ============================================
   Essas aparecem para qualquer pessoa que abrir o site.
   Para deixar uma mira nova "para sempre", copie uma linha,
   troque o nome e cole o código exportado do jogo.

   (As miras adicionadas pelo formulário da página ficam
   salvas só no navegador de quem adicionou.)
*/
const MIRAS_FIXAS = [
    { nome: 'Mira 1', codigo: '0;s;1;P;u;000000FF;h;0;d;1;z;1;a;0.0;f;0;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0;S;c;0;s;1.0' },
    { nome: 'Mira 2', codigo: '0;s;1;P;u;000000FF;h;0;0l;3;0v;3;0o;1;0a;1;0f;0;1b;0;S;c;4;s;0.6' },
    { nome: 'Ponto ciano', codigo: '0;c;1;P;c;5;u;000000FF;h;0;d;1;z;3;f;0;m;1;0b;0;1b;0' },
    { nome: 'Cruz preta', codigo: '0;P;c;8;u;000000FF;h;0;d;1;b;1;z;1;f;0;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0' },
    { nome: 'Verde fina', codigo: '0;s;1;P;c;1;u;000000FF;h;0;f;0;0t;1;0l;2;0v;2;0o;1;0a;1;0f;0;1b;0;S;d;0' },
    { nome: 'Mini com contorno', codigo: '0;c;1;P;u;000000FF;o;1;d;1;z;1;f;0;s;0;m;1;0t;1;0l;1;0v;1;0o;0;0a;1;0f;0;1b;0' },
    { nome: 'Vermelha fina', codigo: '0;P;c;7;u;000000FF;o;0.4;0t;1;0l;2;0v;2;0o;1;0a;1;0m;1;0f;0;0s;0.021;1b;0' },
];

/* ============================================
   MIRAS DE PROS
   ============================================
   Códigos de jogadores profissionais, no mesmo formato das miras acima.
   Os pros trocam de mira com frequência: quando atualizar,
   confira na fonte e mude a data em FONTE_PROS.
*/
const FONTE_PROS = {
    nome: 'ProSettings.net',
    url: 'https://prosettings.net/blog/best-valorant-crosshair-codes/',
    atualizadoEm: 'março de 2026',
};

const MIRAS_PROS = [
    { nome: 'TenZ', codigo: '0;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0' },
    { nome: 'aspas', codigo: '0;s;1;P;c;5;o;1;0l;4;0v;3;0g;1;0o;0;0a;1;0f;0;1b;0;S;c;0;s;1.2;o;1' },
    { nome: 'Demon1', codigo: '0;s;1;P;o;1;d;1;m;1;0b;0;1b;0' },
    { nome: 'Derke', codigo: '0;P;c;8;b;1;t;1;o;1;z;2;a;1;0t;2;0l;6;0v;6;0o;3;0a;0.8;0s;1;0e;1;1t;2;1l;2;1v;2;1o;10;1a;0.35;1s;1;1e;1;u;FFFFFF;d;1;h;1;0g;0;1g;0;0f;0;1f;1;0m;0;1m;1;0b;0;1b;0;m;0' },
    { nome: 'Chronicle', codigo: '0;P;c;7;o;1;f;0;0t;1;0l;3;0v;3;0g;1;0o;2;0a;1;0f;0;1b;0' },
    { nome: 'ZmjjKK', codigo: '0;s;1;P;c;7;u;000000FF;h;0;0l;3;0v;3;0g;1;0o;2;0a;1;0f;0;1b;0;S;c;0;s;1.2;o;1' },
    { nome: 'f0rsakeN', codigo: '0;s;1;P;c;8;u;000000FF;o;1;b;1;0t;3;0l;1;0v;0;0g;1;0o;0;0a;1;0f;0;1t;1;1l;4;1g;1;1o;0;1a;1;1m;0;1f;0;S;s;0.664;o;1' },
    { nome: 'Something', codigo: '0;P;o;0.619;d;1;f;0;s;0;0t;1;0l;0;0o;2;0a;1;0f;0;1b;0' },
    { nome: 'Boaster', codigo: '0;s;1;P;c;1;o;1;d;1;0l;0;0o;2;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;S;c;1;o;1' },
    { nome: 'ScreaM', codigo: '0;s;1;P;c;5;o;1;d;1;z;3;f;0;0t;6;0l;0;0a;1;0f;0;1b;0;S;c;6;s;0.949;o;1' },
    { nome: 'Jinggg', codigo: '0;s;1;P;c;5;u;000000FF;h;0;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0;S;c;5;t;000000FF;s;0;o;1' },
    { nome: 'nAts', codigo: '0;P;c;1;o;1.000;0a;1.000;0l;2;0t;1;0o;2;0f;0;1b;0' },
    { nome: 'Less', codigo: '0;s;1;P;c;8;u;000000FF;h;0;b;1;f;0;0l;4;0o;0;0a;1;0f;0;1b;0' },
    { nome: 'mwzera', codigo: '0;P;c;4;h;0;f;0;0l;2;0o;2;0a;1;0f;0;1b;0' },
    { nome: 'cauanzin', codigo: '0;P;h;0;0l;3;0o;2;0a;1;0f;0;1b;0' },
    { nome: 'tuyz', codigo: '0;s;1;P;u;000000FF;h;0;f;0;m;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0' },
    { nome: 'dgzin', codigo: '0;s;1;P;u;000000FF;o;0;d;1;z;1;f;0;0t;1;0l;3;0v;2;0g;1;0o;0;0a;1;0f;0;1b;0;S;c;5;t;000000FF;s;2.204;o;1' },
    { nome: 'qck', codigo: '0;s;1;P;c;8;u;000000FF;h;0;b;1;f;0;0l;3;0o;0;0a;1;0f;0;1b;0;S;s;0' },
];
