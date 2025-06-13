import LineChartHome from "@/components/charts/LineChartHome";
import PieChartHome from "@/components/charts/PieChartHome";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState, type ChangeEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExpenseType = "spend" | "invest"

export default function Home() {
    //Spending Form
    const [note, setNote] = useState<string>('')
    const [amount, setAmount] = useState<number>(0)

    //Invest Form
    const [typesInvest, setTypesInvest] = useState<string[]>([])
    const [amountInvest, setAmountInvest] = useState<number>(0)
    const [selectedTypeInvest, setSelectedTypeInvest] = useState<string>()

    const [expenseType, setExpenseType] = useState<ExpenseType>("spend")

    const handleChangeExpenseType = async (value: ExpenseType) => {
        const expense = value
        if (expense === "spend" || expense === "invest") {
            setExpenseType(expense)
        }
    }

    const handleChangeInvestType = async (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedTypeInvest(event.target.value)
    }

    return (
        <>
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{expenseType === "spend" ? 'Add New Spending' : 'Add New Investment'}</DialogTitle>
                        <Tabs value={expenseType} onValueChange={(value) => handleChangeExpenseType(value as ExpenseType)} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger name="spend" value="spend">Spend</TabsTrigger>
                                <TabsTrigger name="invest" value="invest">Invest</TabsTrigger>
                            </TabsList>
                            <TabsContent value="spend">
                                <div className="flex flex-col gap-y-5">
                                    <div className="gap-y-2 flex flex-col">
                                        <label>Notes</label>
                                        <input className="rounded-md bg-input h-[36px] p-3" value={note} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)} type="string" ></input>
                                    </div>
                                    <div className="gap-y-2 flex flex-col">
                                        <label>Amount</label>
                                        <div className="flex w-full items-center gap-x-2">
                                            Rp
                                            <input className="rounded-md bg-input h-[36px] p-3" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} type="number"></input>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="invest">
                                <div className="flex flex-col gap-y-5">
                                    <div className="gap-y-2 flex flex-col">
                                        <label>Investment Type</label>
                                        <select className="bg-input rounded-md h-[46px] p-3" value={selectedTypeInvest} onChange={handleChangeInvestType}>
                                            <option style={{backgroundColor:'gray'}} value={"Bond"}>Bond</option>
                                            <option style={{backgroundColor:'gray'}} value={"Crypto"}>Crypto</option>
                                            <option style={{backgroundColor:'gray'}} value={"Scam"}>Scam</option>
                                        </select>
                                    </div>
                                    <div className="gap-y-2 flex flex-col">
                                        <label>Amount</label>
                                        <div className="flex w-full items-center gap-x-2">
                                            Rp
                                            <input className="rounded-md bg-input h-[36px] p-3" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} type="number"></input>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button type="button" variant="default">
                            Add {expenseType === "spend" ? 'Spending' : 'Investment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>


                <p className="text-xl pl-10">2025 Statistic</p>
                {/* Charts */}
                <section className="flex p-3 flex-wrap gap-y-10">
                    <div className="w-full md:w-1/2 h-[260px]">
                        <p className="text-xl text-center">Networth</p>
                        <PieChartHome />
                    </div>
                    <div className="w-full md:w-1/2 h-[250px]">
                        <p className="text-xl text-center">Spending Total</p>
                        <LineChartHome />
                    </div>
                </section>
                {/* Spending List */}
                <section>
                    <div className="w-full mt-10 flex justify-between p-10">
                        <p className="text-center text-xl">This Month Statistic</p>
                        <DialogTrigger>Add New Expense +
                        </DialogTrigger>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 flex pl-10">
                            <div className="w-1/3 border p-3">
                                <p className='text-center text-green-primary border'>Income</p>
                                <div>
                                    Rp123.123.123
                                </div>
                            </div>
                            <div className="w-1/3 border p-3">
                                <p className='text-center text-red-primary border'>Spending</p>
                                <div className="text-center">
                                    -
                                </div>
                            </div>
                            <div className="w-1/3 border p-3">
                                <p className="text-center border">Notes</p>
                                <div>
                                    Note Test
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-wrap gap-5 mt-10 md:mt-0">
                            <div className="text-center w-2/5 text-red-primary">
                                Total Spent : Rp123.123.123
                            </div>
                            <div className="text-center w-2/5 text-green-primary">
                                Total Income : Rp123.123.123
                            </div>
                            <div className="text-center w-2/5 text-green-primary">
                                Invested:  Rp123.123.123
                            </div>
                            <div className="text-center w-2/5 text-green-primary">
                                Remainder:  Rp123.123.123
                            </div>
                        </div>
                    </div>
                </section>
            </Dialog>
        </>
    )
}