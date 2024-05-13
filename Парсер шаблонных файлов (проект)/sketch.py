import re


def get_data_from_string(template: str, string: str, separator_left: str, separator_right: str):
    """
    Функция принимает на вход шаблон текста, состоящий из статичных и переменных частей текста,
    анализируемую строку текста и сочетание символов, используемое в качестве ограничителей переменной в тексте шаблона:

    :param template: размеченная строка-шаблон (например, "<SELLER>, выступающий от лица компании <COMPANY_NAME> на основании <ORDER_NUMBER>", где <SELLER>, <COMPANY_NAME> и <ORDER_NUMBER> стоят на месте изменяемых частей строки, а ", выступающий от лица компании " и " на основании " - статичные части строки)
    :param string: анализируемая строка документа, из которой необходимо извлечь данные по шаблону. Например, "Иванов Иван Иванович, выступающий от лица компании 3D PlastPrint на основании приказа №IN027/SEL0523", где фрагменты "Иванов Иван Иванович", "3D PlastPrint" и "приказа №IN027/SEL0523" будут извлечены под именами переменных <SELLER>, <COMPANY_NAME> и <ORDER_NUMBER> соответственно.
    :param separator_left: символ или сочетание символов, ограничивающее метку переменной слева. В приведенном выше примере это "<"
    :param separator_right: символ или сочетание символов, ограничивающее метку переменной справа. В приведенном выше примере это ">"
    :return: словарь вида {VARIABLE_NAME: VARIABLE_VALUE}, где VARIABLE_NAME - имя переменной, полученное из размеченного шаблона, VARIABLE_VALUE - значение данной переменной, полученное из анализируемой строки. В случае приведенного выше примера будет возвращен словарь {"SELLER": "Иванов Иван Иванович", "COMPANY_NAME": "3D PlastPrint", "ORDER_NUMBER": "приказа №IN027/SEL0523"}
    """

    def replace_variables(string: str, separator_left: str, separator_right: str):
        return re.sub(rf'{separator_left}.*?{separator_right}', '&', string)

    def find_tags_in_string(string, sep_l, sep_r):
        # Регулярное выражение для поиска тэгов
        tag_pattern = re.compile(rf'{sep_l}.*?{sep_r}')

        # Ищем тэги в строке
        tags = tag_pattern.findall(string)

        result_tags = []
        for tag in tags:
            result_tags.append(tag.replace(sep_l, '').replace(sep_r, ''))

        return result_tags

    static = replace_variables(string=template, separator_left=separator_left, separator_right=separator_right)
    for i in static.split('&'):
        if i != '' and i in string:
            string = string.replace(i, '|')
    values = string.split('|')
    variables = find_tags_in_string(string=template, sep_l=separator_left, sep_r=separator_right)
    dict = {}
    for elem in variables:
        if elem == '':
            variables.remove(elem)
    for elem in values:
        if elem == '':
            values.remove(elem)
    print(values)
    print(variables)
    if len(values) == len(variables):
        i = 0
        while i < len(values):
            dict[variables[i]] = values[i]
            i += 1
    return dict


string = "Банк: <BUYER BANK>"
new_string = "Банк: Сбер"

print(get_data_from_string(template=string, string=new_string, separator_left='<', separator_right='>'))
