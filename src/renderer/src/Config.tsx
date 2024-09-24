import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  showYoutube: Yup.boolean(),
  showTwitch: Yup.boolean(),
  showDiscord: Yup.boolean(),
  twitchChannelName: Yup.string().required('O nome do canal é obrigatório'),
  youtubeChannelName: Yup.string().required('O nome do canal é obrigatório'),
  showAvatar: Yup.boolean(),
  showBadges: Yup.boolean(),
  backgroundBubbleOwner: Yup.string().required('Cor de fundo é obrigatória'),
  backgroundBubbleChat: Yup.string().required('Cor de fundo é obrigatória'),
  appBackgroundColor: Yup.string().required('Cor de fundo do app é obrigatória'),
  discordToken: Yup.string(),
  discordChannelId: Yup.string(),
  discordOwnerId: Yup.string(),
});

export default function Config() {
  const formik = useFormik({
    initialValues: window.api.config,
    validationSchema,
    onSubmit: (values) => {
      window.api.updateConfig(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
      <h2 className='text-2xl font-bold'>Configurações do app</h2>
      <hr />
      {/* Show YouTube */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mostrar Chat do YouTube</span>
          <input
            type="checkbox"
            name="showYoutube"
            className="checkbox"
            checked={formik.values.showYoutube}
            onChange={formik.handleChange}
          />
        </label>
      </div>

      {/* Show Twitch */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mostrar Chat da Twitch</span>
          <input
            type="checkbox"
            name="showTwitch"
            className="checkbox"
            checked={formik.values.showTwitch}
            onChange={formik.handleChange}
          />
        </label>
      </div>

      {/* Show Discord */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mostrar Chat do Discord</span>
          <input
            type="checkbox"
            name="showDiscord"
            className="checkbox"
            checked={formik.values.showDiscord}
            onChange={formik.handleChange}
          />
        </label>
      </div>

      {/* Twitch Channel Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nome do canal Twitch</span>
        </label>
        <input
          type="text"
          name="twitchChannelName"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.twitchChannelName}
        />
        {formik.errors.twitchChannelName && (
          <span className="text-red-500 text-sm">{formik.errors.twitchChannelName}</span>
        )}
      </div>

      {/* YouTube Channel Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nome do canal YouTube</span>
        </label>
        <input
          type="text"
          name="youtubeChannelName"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.youtubeChannelName}
        />
        {formik.errors.youtubeChannelName && (
          <span className="text-red-500 text-sm">{formik.errors.youtubeChannelName}</span>
        )}
      </div>

      {/* Show Avatar */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mostrar Avatar quando disponível</span>
          <input
            type="checkbox"
            name="showAvatar"
            className="checkbox"
            checked={formik.values.showAvatar}
            onChange={formik.handleChange}
          />
        </label>
      </div>

      {/* Show Badges */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mostrar Badges</span>
          <input
            type="checkbox"
            name="showBadges"
            className="checkbox"
            checked={formik.values.showBadges}
            onChange={formik.handleChange}
          />
        </label>
      </div>

      {/* Background Bubble Owner */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Cor do fundo do proprietário da bolha</span>
        </label>
        <input
          type="text"
          name="backgroundBubbleOwner"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.backgroundBubbleOwner}
        />
        {formik.errors.backgroundBubbleOwner && (
          <span className="text-red-500 text-sm">{formik.errors.backgroundBubbleOwner}</span>
        )}
      </div>

      {/* Background Bubble Chat */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Cor do fundo do chat</span>
        </label>
        <input
          type="text"
          name="backgroundBubbleChat"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.backgroundBubbleChat}
        />
        {formik.errors.backgroundBubbleChat && (
          <span className="text-red-500 text-sm">{formik.errors.backgroundBubbleChat}</span>
        )}
      </div>

      {/* App Background Color */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Cor de fundo do app</span>
        </label>
        <input
          type="text"
          name="appBackgroundColor"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.appBackgroundColor}
        />
        {formik.errors.appBackgroundColor && (
          <span className="text-red-500 text-sm">{formik.errors.appBackgroundColor}</span>
        )}
      </div>

      {/* Discord Token */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Token do Discord</span>
        </label>
        <input
          type="text"
          name="discordToken"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.discordToken}
        />
      </div>

      {/* Discord Channel ID */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">ID do canal do Discord</span>
        </label>
        <input
          type="text"
          name="discordChannelId"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.discordChannelId}
        />
      </div>

      {/* Discord Owner ID */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">ID do proprietário do Discord</span>
        </label>
        <input
          type="text"
          name="discordOwnerId"
          className="input input-bordered"
          onChange={formik.handleChange}
          value={formik.values.discordOwnerId}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-full btn btn-primary mt-4">
        Salvar
      </button>
    </form>
  );
}
