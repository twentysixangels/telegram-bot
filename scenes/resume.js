const { Markup, Composer, Scenes } = require('telegraf');

const startStep = new Composer();
startStep.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userName = ctx.message.from.username;
    ctx.wizard.state.data.firstName = ctx.message.from.first_name;
    ctx.wizard.state.data.lastName = ctx.message.from.last_name;
    ctx.wizard.state.data.start = ctx.message.text;
    await ctx.replyWithHTML(
      '<b>ШАБЛОН ДЛЯ ЗАПОЛНЕНИЯ РЕЗЮМЕ</b>\n\n<i>1. Должность(кто требуется)\n2. Пол "М/Ж"\n3. Возраст\n4. Требования(по желанию)\n5. Условия труда(по желанию)\n6. Город\n7. Контакты</i>'
    );
    return ctx.wizard.next();
  } catch (e) {
    console.log(e);
  }
});

const conditionStep = new Composer();
conditionStep.on('text', async (ctx) => {
  try {
    ctx.wizard.state.data.condition = ctx.message.text;
    const wizardData = ctx.wizard.state.data;
    await ctx.replyWithHTML(`<b>${wizardData.condition}</b>`);
    await ctx.replyWithHTML(
      `Ваше <b>объявление</b> успешно отправлена Администратору!`
    );

    await ctx.telegram.sendMessage(
      process.env.NODE_USER_ID,
      `<b>РЕЗЮМЕ</b>\n\n<b>${wizardData.condition}</b>`,
      {
        parse_mode: 'HTML',
      }
    );
    await ctx.reply(
      'Выберите один из вариантов:',
      Markup.keyboard([
        [Markup.button.callback('\u{1F4E2}Подать объявление\u{1F4E2}', 'btn1')],
        [
          Markup.button.callback(
            '\u{1F4E2}Посмотреть все объявления\u{1F4E2}',
            'btn2'
          ),
        ],
        [Markup.button.callback('Написать админу', 'btn3')],
      ])
        .oneTime()
        .resize()
    );
    return ctx.scene.leave();
  } catch (e) {
    console.log(e);
  }
});

const resumeScene = new Scenes.WizardScene(
  'resumeWizard',
  startStep,
  conditionStep
);
module.exports = resumeScene;
