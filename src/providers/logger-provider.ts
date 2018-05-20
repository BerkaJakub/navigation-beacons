import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Injectable()
export class LoggerProvider {

    msgStack: Array<string>;

    constructor(public file: File, public platform: Platform, public events: Events) {
        this.msgStack = [];
    }

    /**
     * Creates file with name in logs directory
     * @param file name of the file
     */
    createFile(file) {
        var dirName = "logs";
        let content = "Created log file: " + file + "\n";

        this.file.checkDir(this.file.externalApplicationStorageDirectory, dirName).then(_ => {
            //console.log('Directory exists');
            this.file.writeFile(this.file.externalApplicationStorageDirectory + "logs", file, content).then(() => {
                //console.log("file created");
            }).catch(err => console.log(err));
        }).catch(err => {
            //console.log('Directory doesnt exist');
            let result = this.file.createDir(this.file.externalApplicationStorageDirectory, dirName, true);

            result.then(data => {
                this.file.writeFile(this.file.externalApplicationStorageDirectory + "logs", file, content).then(() => {
                    //console.log("file created");
                }).catch(err => console.log(err));

            }).catch(error => {
                //console.log(error);
            });

        });
    }

    log(message, file) {
        message = message + "   " + new Date().toJSON().slice(0, 19) + "\n";
        this.msgStack.push(message);


    }

    /**
     * Empty stack of messages and writes it to the file
     */
    emptyStack(file) {
        console.log(this.msgStack);
        const message = this.msgStack.join("");
        this.file.writeFile(this.file.externalApplicationStorageDirectory + "logs", file, message, { replace: false, append: true }).then(() => {
            
        }).catch(err => console.log(err));

    }

}