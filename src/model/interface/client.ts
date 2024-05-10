export interface ClientData {
    nickname: string;
    password: string;
    age: number;
    gender: string;
    email: string;
    weight: number;
    height: number;
}

export interface ClientWorkout {
    day: string,
    name: string,
    series: number,
    reps: number[],
    kg: number
}