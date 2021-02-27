import React from 'react';
import Modal from './Modal';

export default {
  title: 'atoms/Modal',
  component: Modal,
};

export const Default = () => (
  <Modal priority={0} onCloseButtonClick={() => {}}>
    <article
      style={{
        padding: '0 4em 4em 4em',
        margin: '0 auto',
        maxWidth: '80ch',
        textAlign: 'justify',
      }}
    >
      <h1>Modal content</h1>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        nunc erat, quis semper dolor laoreet viverra. Nulla mollis lorem
        finibus, imperdiet mauris vitae, viverra risus. Nullam molestie
        facilisis justo, cursus feugiat mauris sollicitudin ut. Etiam quis
        cursus erat. Fusce mattis bibendum metus, vitae maximus nisi consectetur
        nec. Aenean id facilisis neque. Vivamus mattis, ex sit amet consectetur
        malesuada, urna diam pellentesque diam, et dictum nibh orci eget nibh.
        Aenean egestas orci eget ligula condimentum, sit amet volutpat erat
        consectetur. Nullam nibh ligula, gravida ultricies gravida id,
        consectetur non dui. Curabitur eu dignissim ante, facilisis tincidunt
        purus. In hac habitasse platea dictumst. Vivamus at ullamcorper quam.
        Aliquam eget dignissim ligula, at tincidunt diam.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Proin vel turpis ac mauris viverra consequat sed sit amet purus. Aenean
        laoreet facilisis luctus. Duis sed metus in massa accumsan ornare
        laoreet et arcu. Donec commodo finibus tellus, et pellentesque erat.
        Vivamus auctor aliquet pretium. Cras ligula ex, commodo ut felis at,
        auctor porttitor tortor. Nam maximus erat at felis mattis eleifend. Ut
        tristique quam dapibus tortor tempor tempor. Nunc dictum, nisi nec
        rutrum vestibulum, nisi ante auctor tellus, et euismod orci diam id leo.
        Aenean elit dolor, viverra quis felis vel, volutpat dignissim felis.
        Duis venenatis nibh est, vehicula malesuada neque pretium quis.
        Curabitur eu mi vel risus molestie sollicitudin nec sed augue.
      </p>

      <p>
        Donec sit amet justo augue. Maecenas dignissim vel enim eget dapibus.
        Sed lorem eros, porta nec est sed, ultricies dignissim massa. Aliquam
        aliquam dignissim ultricies. Donec elit nibh, finibus eget ornare non,
        aliquet nec est. Sed suscipit malesuada volutpat. Quisque mattis magna
        ipsum, in molestie tortor porttitor sit amet. Vestibulum at dictum
        augue. Maecenas vel eros dolor. Quisque lobortis purus in magna blandit
        tincidunt. Donec quis leo fringilla eros fringilla faucibus id et lacus.
        Nulla accumsan arcu eu velit mollis lobortis. Fusce vitae mi et risus
        ullamcorper bibendum. Sed vehicula convallis nulla.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        nunc erat, quis semper dolor laoreet viverra. Nulla mollis lorem
        finibus, imperdiet mauris vitae, viverra risus. Nullam molestie
        facilisis justo, cursus feugiat mauris sollicitudin ut. Etiam quis
        cursus erat. Fusce mattis bibendum metus, vitae maximus nisi consectetur
        nec. Aenean id facilisis neque. Vivamus mattis, ex sit amet consectetur
        malesuada, urna diam pellentesque diam, et dictum nibh orci eget nibh.
        Aenean egestas orci eget ligula condimentum, sit amet volutpat erat
        consectetur. Nullam nibh ligula, gravida ultricies gravida id,
        consectetur non dui. Curabitur eu dignissim ante, facilisis tincidunt
        purus. In hac habitasse platea dictumst. Vivamus at ullamcorper quam.
        Aliquam eget dignissim ligula, at tincidunt diam.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Proin vel turpis ac mauris viverra consequat sed sit amet purus. Aenean
        laoreet facilisis luctus. Duis sed metus in massa accumsan ornare
        laoreet et arcu. Donec commodo finibus tellus, et pellentesque erat.
        Vivamus auctor aliquet pretium. Cras ligula ex, commodo ut felis at,
        auctor porttitor tortor. Nam maximus erat at felis mattis eleifend. Ut
        tristique quam dapibus tortor tempor tempor. Nunc dictum, nisi nec
        rutrum vestibulum, nisi ante auctor tellus, et euismod orci diam id leo.
        Aenean elit dolor, viverra quis felis vel, volutpat dignissim felis.
        Duis venenatis nibh est, vehicula malesuada neque pretium quis.
        Curabitur eu mi vel risus molestie sollicitudin nec sed augue.
      </p>

      <p>
        Donec sit amet justo augue. Maecenas dignissim vel enim eget dapibus.
        Sed lorem eros, porta nec est sed, ultricies dignissim massa. Aliquam
        aliquam dignissim ultricies. Donec elit nibh, finibus eget ornare non,
        aliquet nec est. Sed suscipit malesuada volutpat. Quisque mattis magna
        ipsum, in molestie tortor porttitor sit amet. Vestibulum at dictum
        augue. Maecenas vel eros dolor. Quisque lobortis purus in magna blandit
        tincidunt. Donec quis leo fringilla eros fringilla faucibus id et lacus.
        Nulla accumsan arcu eu velit mollis lobortis. Fusce vitae mi et risus
        ullamcorper bibendum. Sed vehicula convallis nulla.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>
    </article>
  </Modal>
);

export const Black = () => (
  <Modal priority={0} background="black" onCloseButtonClick={() => {}}>
    <article
      style={{
        padding: '0 1em 4em 1em',
        margin: '0 auto',
        maxWidth: '80ch',
        textAlign: 'justify',
      }}
    >
      <h1>Modal content</h1>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        nunc erat, quis semper dolor laoreet viverra. Nulla mollis lorem
        finibus, imperdiet mauris vitae, viverra risus. Nullam molestie
        facilisis justo, cursus feugiat mauris sollicitudin ut. Etiam quis
        cursus erat. Fusce mattis bibendum metus, vitae maximus nisi consectetur
        nec. Aenean id facilisis neque. Vivamus mattis, ex sit amet consectetur
        malesuada, urna diam pellentesque diam, et dictum nibh orci eget nibh.
        Aenean egestas orci eget ligula condimentum, sit amet volutpat erat
        consectetur. Nullam nibh ligula, gravida ultricies gravida id,
        consectetur non dui. Curabitur eu dignissim ante, facilisis tincidunt
        purus. In hac habitasse platea dictumst. Vivamus at ullamcorper quam.
        Aliquam eget dignissim ligula, at tincidunt diam.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Proin vel turpis ac mauris viverra consequat sed sit amet purus. Aenean
        laoreet facilisis luctus. Duis sed metus in massa accumsan ornare
        laoreet et arcu. Donec commodo finibus tellus, et pellentesque erat.
        Vivamus auctor aliquet pretium. Cras ligula ex, commodo ut felis at,
        auctor porttitor tortor. Nam maximus erat at felis mattis eleifend. Ut
        tristique quam dapibus tortor tempor tempor. Nunc dictum, nisi nec
        rutrum vestibulum, nisi ante auctor tellus, et euismod orci diam id leo.
        Aenean elit dolor, viverra quis felis vel, volutpat dignissim felis.
        Duis venenatis nibh est, vehicula malesuada neque pretium quis.
        Curabitur eu mi vel risus molestie sollicitudin nec sed augue.
      </p>

      <p>
        Donec sit amet justo augue. Maecenas dignissim vel enim eget dapibus.
        Sed lorem eros, porta nec est sed, ultricies dignissim massa. Aliquam
        aliquam dignissim ultricies. Donec elit nibh, finibus eget ornare non,
        aliquet nec est. Sed suscipit malesuada volutpat. Quisque mattis magna
        ipsum, in molestie tortor porttitor sit amet. Vestibulum at dictum
        augue. Maecenas vel eros dolor. Quisque lobortis purus in magna blandit
        tincidunt. Donec quis leo fringilla eros fringilla faucibus id et lacus.
        Nulla accumsan arcu eu velit mollis lobortis. Fusce vitae mi et risus
        ullamcorper bibendum. Sed vehicula convallis nulla.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        nunc erat, quis semper dolor laoreet viverra. Nulla mollis lorem
        finibus, imperdiet mauris vitae, viverra risus. Nullam molestie
        facilisis justo, cursus feugiat mauris sollicitudin ut. Etiam quis
        cursus erat. Fusce mattis bibendum metus, vitae maximus nisi consectetur
        nec. Aenean id facilisis neque. Vivamus mattis, ex sit amet consectetur
        malesuada, urna diam pellentesque diam, et dictum nibh orci eget nibh.
        Aenean egestas orci eget ligula condimentum, sit amet volutpat erat
        consectetur. Nullam nibh ligula, gravida ultricies gravida id,
        consectetur non dui. Curabitur eu dignissim ante, facilisis tincidunt
        purus. In hac habitasse platea dictumst. Vivamus at ullamcorper quam.
        Aliquam eget dignissim ligula, at tincidunt diam.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>

      <p>
        Proin vel turpis ac mauris viverra consequat sed sit amet purus. Aenean
        laoreet facilisis luctus. Duis sed metus in massa accumsan ornare
        laoreet et arcu. Donec commodo finibus tellus, et pellentesque erat.
        Vivamus auctor aliquet pretium. Cras ligula ex, commodo ut felis at,
        auctor porttitor tortor. Nam maximus erat at felis mattis eleifend. Ut
        tristique quam dapibus tortor tempor tempor. Nunc dictum, nisi nec
        rutrum vestibulum, nisi ante auctor tellus, et euismod orci diam id leo.
        Aenean elit dolor, viverra quis felis vel, volutpat dignissim felis.
        Duis venenatis nibh est, vehicula malesuada neque pretium quis.
        Curabitur eu mi vel risus molestie sollicitudin nec sed augue.
      </p>

      <p>
        Donec sit amet justo augue. Maecenas dignissim vel enim eget dapibus.
        Sed lorem eros, porta nec est sed, ultricies dignissim massa. Aliquam
        aliquam dignissim ultricies. Donec elit nibh, finibus eget ornare non,
        aliquet nec est. Sed suscipit malesuada volutpat. Quisque mattis magna
        ipsum, in molestie tortor porttitor sit amet. Vestibulum at dictum
        augue. Maecenas vel eros dolor. Quisque lobortis purus in magna blandit
        tincidunt. Donec quis leo fringilla eros fringilla faucibus id et lacus.
        Nulla accumsan arcu eu velit mollis lobortis. Fusce vitae mi et risus
        ullamcorper bibendum. Sed vehicula convallis nulla.
      </p>

      <p>
        Praesent commodo erat sapien, sit amet luctus sapien tempus quis. Donec
        sed turpis eu enim feugiat ultricies. In pulvinar viverra ipsum id
        posuere. Proin tristique scelerisque turpis non gravida. Integer
        vulputate accumsan sapien at tincidunt. Suspendisse sit amet sodales
        libero. Ut tempus bibendum velit, at consectetur urna semper sit amet.
        Nam scelerisque massa leo, ac porta nunc ornare et. Curabitur facilisis
        leo non odio mattis, non ultrices sem iaculis. Pellentesque vitae justo
        at elit tincidunt hendrerit. Duis quis volutpat enim. Proin metus enim,
        aliquam a nisl a, tempor consectetur dui. Phasellus a magna posuere
        massa aliquet congue.
      </p>
    </article>
  </Modal>
);
