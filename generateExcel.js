import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import moment from 'moment-jalaali';
import {ToastAndroid} from 'react-native';

const generate = async data => {
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'data');
  const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

  const directory = () => {
    const date = moment(new Date()).format('jYYYY/jMM/jDD').split('/');
    const year = date[0].toString();
    const month = date[1].toString();
    const day = date[2].toString();
    return `${RNFS.ExternalStorageDirectoryPath}/Documents/Anea3D/${year}/${month}/${day}`;
  };

  if (!(await RNFS.exists(directory()))) {
    RNFS.mkdir(directory()).catch(console.log);
  }
  RNFS.writeFile(`${directory()}/${Date.now()}.xlsx`, wbout, 'ascii')
    .then(r => {
      ToastAndroid.showWithGravity(
        `File Saved in ${directory()}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    })
    .catch(e => {
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    });
};

const generateExcel = async (data = []) => {
  const writePermission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  try {
    let isPermitedWriteExternalStorage = await PermissionsAndroid.check(
      writePermission,
    );

    if (!isPermitedWriteExternalStorage) {
      const granted = await PermissionsAndroid.request(writePermission);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        generate(data);
      } else {
        ToastAndroid.showWithGravity(
          'Permission denied',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    } else {
      generate(data);
    }
  } catch (e) {
    ToastAndroid.showWithGravity(
      'Error while checking permission',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
    return;
  }
};

export default generateExcel;
