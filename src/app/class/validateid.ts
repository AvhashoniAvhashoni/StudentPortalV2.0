export class ValidateId {

    count = 0;
    A = 0
    B = 0
    D = 0
    Z = 0
    ID: number
    valid: boolean;

    constructor() { }

    verifyID(id: number) {
        this.ID = id;
        var verifyNumber = 0;
        var stringEven = "";
        while (this.count <= 12) {

            if (this.count % 2 == 0) {
                //Odd positioned digits except the last digit
                if (this.count != 0)
                    this.A += this.ID % 10;
                else
                    verifyNumber = this.ID % 10;

            } else
                stringEven += "" + this.ID % 10;

            this.ID = Math.floor(this.ID / 10);
            this.count += 1;

        }//eend of while loop

        this.B = this.calculatingEvenlyPositionedNumbers(stringEven) //calculating even positioned digits and returning the sum after some calculations
        this.D = this.B + this.A;
        this.Z = 10 - (this.D % 10);
        this.Z = (this.Z == 10) ? 0 : this.Z;

        if (verifyNumber == this.Z)
            this.valid = true;
        else
            this.valid = false;

        this.count = this.A = this.B = this.D = this.Z = 0;// re-initializing variables again
        return this.valid;
    }

    calculatingEvenlyPositionedNumbers(evenPosition: string) {

        var counter = 0;
        var evenSum = 0;
        var evenNumberLength = 0;
        evenPosition = this.reverse(evenPosition)
        var evenNum = Number(evenPosition);//converting a string of even postioned digits to numbers and storing it on variable evenNum
        evenNum = evenNum * 2;
        evenNumberLength = evenNum.toString().length;//getting the length of the evenNum after mutliplying by 2

        while (counter < evenNumberLength) {
            evenSum += evenNum % 10;//Adding a digit one by one from evenNum to evenSum
            evenNum = Math.floor(evenNum / 10);//removing the added digit from the evenNum
            counter += 1;
        }
        return evenSum;
    }

    reverse(str: string) {
        return str.split('').reverse().join('');
    }
}