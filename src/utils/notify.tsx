import { HiLightningBolt } from 'react-icons/hi';
import { MdOutlineClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import cls from 'classnames';
import { ReactNode } from 'react';

export const notify = (content: ReactNode) =>
  toast.custom(
    (t) => (
      <div className={cls(['notificationWrapper', t.visible ? 'top-10' : '-top-96'])}>
        <div className="iconWrapper">
          <HiLightningBolt />
        </div>
        <div className="contentWrapper">{content}</div>
        <div className="closeIcon" onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: 'unique-notification', position: 'bottom-center' },
  );
