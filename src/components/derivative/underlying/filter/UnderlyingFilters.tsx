import React, {Component} from "react";
import {Button, Dropdown, Modal, Nav} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import SvgImage from "../../../common/image/SvgImage";
import {UnderlyingSearch} from "./UnderlyingSearch";
import {Instrument} from "../../../../generated/graphql";
import {trigInfonline} from "../../../common/InfonlineService";

export enum FilterType {
    'top5Searched', 'top5Traded', 'top5Dax', 'worst5Dax', 'custom'
}

interface UnderlyingFiltersProps {
    showCustomAsset: any;
    showAllAssets: (filter: FilterType) => any;
    customAsset: string;
}

interface UnderlyingFiltersState {
    type: FilterType;
    showSearch: boolean;
    showModal?: boolean;
}

interface Filter {
    type: FilterType;
    name: string;
    description: string;
    handler: ((asset?: Instrument) => any | void);
}

abstract class UnderlyingFilter extends Component<UnderlyingFiltersProps, UnderlyingFiltersState> {
    filters: Filter[];
    customFilter: Filter;

    constructor(props: any) {
        super(props);
        this.state = {type: FilterType.top5Dax, showSearch: false};
        this.filters = [
            {
                type: FilterType.top5Dax,
                name: 'Top Dax',
                description: '5 beste Dax Werte',
                handler: () => {
                    trigInfonline('derivatives', 'basiswertauswahl_topDax')
                    this.showAllAsset(FilterType.top5Dax)
                }
            },
            {
                type: FilterType.worst5Dax,
                name: 'Flop Dax',
                description: '5 schlechteste Dax Werte',
                handler: () => {
                    trigInfonline('derivatives', 'basiswertauswahl_flopDax')
                    this.showAllAsset(FilterType.worst5Dax)
                }
            },
            {
                type: FilterType.top5Searched,
                name: 'Meistgesucht',
                description: 'Top 5 Basiswerte',
                handler: () => {
                    trigInfonline('derivatives', 'basiswertauswahl_Meistgesucht')
                    this.showAllAsset(FilterType.top5Searched)
                }
            },
            {
                type: FilterType.top5Traded,
                name: 'Meistgehandelt',
                description: 'Top 5 Basiswerte',
                handler: () => {
                    this.showAllAsset(FilterType.top5Traded)
                    trigInfonline('derivatives', 'basiswertauswahl_Meistgehandelt')
                }
            }
        ];
        this.customFilter = {
            type: FilterType.custom,
            name: 'Eigener Basiswert',
            description: 'auswählen...',
            handler: (name?: Instrument) => {
                trigInfonline('derivatives', 'basiswertauswahl_Eigener_Basiswert');
                // debugger
                if(name) this.showCustom(name);
            }
        }
    }

    findSelectedFilter() {
        return this.filters.find(t => t.type === this.state.type) || this.customFilter;
    }

    selectedFilterName() {
        return this.findSelectedFilter().name;
    }

    selectedFilterDescription() {
        let filter = this.findSelectedFilter();
        return (filter.type === FilterType.custom && this.props.customAsset) || filter.description;
    }

    showAllAsset(type: FilterType) {
        this.props.showAllAssets(type);
        this.setState({type: type});
    }

    showCustom(asset: Instrument) {
        this.props.showCustomAsset(asset);
        this.setState({type: FilterType.custom});
    }
}

class UnderlyingFilterXl extends UnderlyingFilter {
    render() {
        let toggleButton: HTMLButtonElement;
        return (<>
                <div className="pt-4 d-none  d-xl-block view-selection derivative-underlying-filters">
                    <Nav>
                        {
                            this.filters.map(filter =>
                                <Button key={filter.type} variant="light" onClick={() => filter.handler()}
                                        className={"text-blue bg-white " + (this.state.type === filter.type ? 'active' : '')}>
                                    <h3 className="view-type underlying-filter-button-title">{filter.name}</h3>
                                    <span>{filter.description}</span>
                                </Button>)
                        }
                        <Dropdown className="dropdown-select no-after-pointer dropdown-keep-open">
                            <Dropdown.Toggle variant="light" id="basiswert-drop"
                                             ref={(ins: HTMLButtonElement) => toggleButton = ins}
                                             className={"bg-white text-blue" + (this.state.type === this.customFilter.type ? ' active' : '')}>
                                <span className="view-type">Eigener Basiswert
                                    <i className={"drop-arrow down right-float-arrow border-" + (this.state.type === this.customFilter.type ? 'white' : 'blue')}/>
                                </span>
                                <span>{this.props.customAsset || 'auswählen...'}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right dropdown-search-filter"
                                           style={{width: "730px"}}>
                                <div className="drop-header">Sortierung
                                    <SvgImage icon="icon_close_dark.svg"
                                              spanClass="drop-arrow-image close-icon top-move"
                                              imgClass="svg-grey" convert={true} onClick={() => toggleButton?.click()}/>
                                </div>
                                <UnderlyingSearch onAssetSelected={this.customFilter.handler}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </div>
            </>
        );
    }
}

class UnderlyingFilterLg extends UnderlyingFilter {
    toggleButton?: HTMLButtonElement;
    searchToggleButton?: HTMLButtonElement;

    componentDidUpdate() {
        this.searchToggleButton?.click();
    }

    render() {
        return (<>
            <div
                className="pt-4 d-none d-lg-block d-xl-none heading-with-info derivate-page-filter-wrap stick-it-top-15-offset">
                <div className="filters-holder derivate-page-filters">
                    <Dropdown className="dropdown-select dropdown-filter dropdown-keep-open no-after-pointer sort-drop">
                        <DropdownToggle variant="blue" ref={(ref: any) => this.toggleButton = ref}>
                            <div className="drop-legend">{this.selectedFilterName()}</div>
                            <div className="drop-selection">{this.selectedFilterDescription()}</div>
                            <SvgImage spanClass="drop-arrow-image open-icon top-move" convert={true}
                                      icon="icon_direction_down_dark.svg" imgClass="svg-white"/>
                            <SvgImage spanClass="drop-arrow-image close-icon top-move" convert={true}
                                      icon="icon_close_dark.svg" imgClass="svg-white"/>
                        </DropdownToggle>
                        <DropdownMenu>
                            <div className="drop-header">
                                <span>Basiswertauswahl</span>
                                <SvgImage spanClass="drop-arrow-image close-icon top-move"
                                          icon="icon_close_dark.svg" imgClass="svg-grey" convert={true}
                                          onClick={() => this.toggleButton?.click()}/>
                            </div>
                            <div className="drop-body">
                                <Nav className="body-row only-buttons">
                                    {
                                        this.filters.map(filter =>
                                            <Button key={filter.type} variant="grey" onClick={() => filter.handler()}
                                                    className={'btn-border-gray' + (this.state.type === filter.type ? ' active' : '')}>
                                                <h3 className={"font-size-14px mb-0"} style={{fontWeight: 700}}>{filter.name}</h3>
                                                <div>{filter.description}</div>
                                            </Button>)
                                    }
                                </Nav>
                                <div className="body-row only-buttons border-0 p-0 m-0">
                                    <Button variant="grey" onClick={() => this.setState(oldState => ({
                                        showSearch: !oldState.showSearch
                                    }))}
                                            className={'btn-border-gray button-for-outer-dropdown with-drop-arrow ' + (this.state.type === this.customFilter.type ? ' active' : '')}>
                                        <div className="view-type">{this.customFilter.name}
                                            <i className="drop-arrow down right-float-arrow border-blue"/>
                                        </div>
                                        <div>{this.props.customAsset || this.customFilter.description}</div>
                                    </Button>
                                </div>
                            </div>
                            <div className="drop-footer">
                                <Button className="text-blue d-flex align-items-center dropdown-close-button"
                                        variant="link" onClick={() => this.toggleButton?.click()}>
                                    <SvgImage icon="icon_check_hook_dark.svg" imgClass="svg-green" convert={true}/>
                                    <span>Anwenden</span>
                                </Button>
                            </div>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown
                        className="dropdown-select dropdown-filter dropdown-keep-open no-after-pointer sort-drop inner-open-drop basiswert-inner-drop">
                        <Dropdown.Toggle variant="blue" id="basiswert-drop-button"
                                         ref={(ins: HTMLButtonElement) => this.searchToggleButton = ins}/>
                        <Dropdown.Menu style={{width: "100%"}}>
                            <div className="drop-header">Basiswert
                                <SvgImage spanClass="drop-arrow-image close-icon top-move dropdown-close-button"
                                          icon="icon_close_dark.svg" imgClass="svg-grey" convert={true}
                                          onClick={() => this.searchToggleButton?.click()}/>
                            </div>
                            <UnderlyingSearch onAssetSelected={this.customFilter.handler}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>
        </>);
    }
}

class UnderlyingFilterSm extends UnderlyingFilter {
    hideMainModal() {
        this.setState({
            showModal: false
        });
    }

    showMainModal() {
        this.setState({
            showModal: true
        });
    }

    hideSearchModal() {
        this.setState({
            showSearch: false
        });
    }

    showSearchModal() {
        this.hideMainModal();
        this.setState({
            showSearch: true
        });
    }

    render() {
        return (<>
                <div className="pt-4 d-block d-lg-none heading-with-info derivate-page-filter-wrap stick-it-top-15-offset">
                    <div className="derivate-page-filters">
                        <Dropdown className="dropdown-select dropdown-filter mb-n4 ml-1 no-after-pointer sort-drop">
                            <DropdownToggle variant="blue" onClick={this.showMainModal.bind(this)} className={"d-flex"}>
                                <div className="drop-legend">{this.selectedFilterName()}</div>
                                <div className="drop-selection ml-1 mr-5">{this.selectedFilterDescription()}</div>
                                <SvgImage spanClass="drop-arrow-image ml-4 open-icon top-move" convert={true}
                                          icon="icon_direction_down_dark.svg" imgClass="svg-white"/>
                                <SvgImage spanClass="drop-arrow-image d-none close-icon top-move" convert={true}
                                          icon="icon_close_dark.svg" imgClass="svg-white"/>
                            </DropdownToggle>
                        </Dropdown>
                    </div>
                </div>

                <Modal className="bottom modal-dialog-sky-placement" backdrop="static" show={this.state.showModal}>
                    <Modal.Dialog className="all-white-modal filters-modal">
                        <div className="modal-content">
                            <Modal.Header>
                                <h5 className="modal-title" id="">Ansicht</h5>
                                <button type="button" className="close text-blue" aria-label="Close"
                                        onClick={this.hideMainModal.bind(this)}>
                                    <span>schließen</span>
                                    <SvgImage icon="icon_close_dark.svg" spanClass="close-modal-butt"
                                              imgClass="svg-blue" convert={true}/>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="filter-body">
                                    <div className="body-row only-buttons nav" role="tablist">
                                        {
                                            this.filters.map(filter =>
                                                <Button key={filter.type} variant="grey"
                                                        onClick={() => filter.handler()}
                                                        className={'btn-border-gray' + (this.state.type === filter.type ? ' active' : '')}>
                                                    <h3 className={"font-size-14px"} style={{fontWeight: 700, marginBottom: -1, paddingTop: 1}}>{filter.name}</h3>
                                                    <div>{filter.description}</div>
                                                </Button>)
                                        }
                                        <Button variant="gray"
                                                className={'btn-border-gray with-drop-arrow' + (this.state.type === this.customFilter.type ? ' active' : '')}
                                                onClick={this.showSearchModal.bind(this)}>
                                            <div className="view-type">{this.customFilter.name}
                                                <i className="drop-arrow down right-float-arrow border-blue"/>
                                            </div>
                                            <div>{this.props.customAsset || this.customFilter.description}</div>
                                        </Button>
                                    </div>
                                    <div className="filter-footer">
                                        <Button variant="link" className="text-blue d-flex align-items-center"
                                                onClick={this.hideMainModal.bind(this)}>
                                            <SvgImage icon="icon_check_hook_dark.svg" imgClass="svg-green"
                                                      convert={true}/>
                                            <span>Anwenden</span>
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </div>
                    </Modal.Dialog>
                </Modal>

                <Modal className="bottom modal-dialog-sky-placement" backdrop="static" show={this.state.showSearch}>
                    <Modal.Dialog className="all-white-modal filters-modal">
                        <div className="modal-content">
                            <Modal.Header>
                                <h5 className="modal-title" id="">Basiswert auswählen</h5>
                                <Button className="close text-blue" onClick={this.hideSearchModal.bind(this)}>
                                    <span>schließen</span>
                                    <SvgImage icon="icon_close_dark.svg" spanClass="close-modal-butt"
                                              imgClass="svg-blue" convert={true}/>
                                </Button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="filter-section-modal">
                                    <UnderlyingSearch onAssetSelected={() => {
                                        this.setState({showSearch: false, showModal: false})
                                        this.customFilter.handler();
                                    }}
                                                      inputSize="sm"/>
                                </div>
                            </Modal.Body>
                        </div>
                    </Modal.Dialog>
                </Modal>
            </>
        );
    }
}

export default class UnderlyingFilters extends Component
    <UnderlyingFiltersProps, UnderlyingFiltersState> {
    render() {
        return (<>
            <UnderlyingFilterXl {...this.props}/>
            <UnderlyingFilterLg {...this.props}/>
            <UnderlyingFilterSm {...this.props}/>
        </>);
    }
}
