export function ToggleBox(props) {
    return (
        <div class="flex flex-col items-center w-4/5  border-b-4">
            <details class="flex flex-row w-3/4 h-2/5 items-center p-5" closed>
                <summary class="text-2xl font-Outfit leading-6 text-slate-900 font-semibold select-none">
                    {props.question}
                </summary>
                <div class="mt-3 text-sm leading-6 text-black">
                    <p>{props.content}</p>
                </div>
            </details>
        </div>
    );

}